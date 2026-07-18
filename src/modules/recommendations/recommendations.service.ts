import { getDb } from '../../lib/mongodb';
import { AppError } from '../../middlewares/errorHandler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env';
import { buildRecommendationPrompt } from '../../utils/prompts';
import { ObjectId } from 'mongodb';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

interface RecommendationDoc {
    _id?: ObjectId;
    userId: ObjectId;
    items: Array<{
        title: string;
        url: string;
        type: string;
        reason: string;
        feedback?: boolean;
    }>;
    generatedAt: Date;
    expiresAt: Date;
}

export async function getRecommendationsForUser(userId: string) {
    const db = await getDb();
    const existing = await db.collection<RecommendationDoc>('recommendations').findOne({
        userId: new ObjectId(userId),
        expiresAt: { $gt: new Date() },
    });

    if (existing) return existing.items;

    // Gather user context (same as before)
    const interactions = await db.collection('interactions').find({ userId: new ObjectId(userId) }).toArray();
    const viewedPlans = interactions.filter(i => i.action === 'view').map(i => i.planId);
    const plans = await db.collection('plans').find({ _id: { $in: viewedPlans } }).project({ subject: 1, difficulty: 1 }).toArray();
    const topics = [...new Set(plans.map(p => p.subject))];
    const difficulties = plans.map(p => p.difficulty);
    const mostCommonDifficulty = difficulties.sort((a, b) =>
        difficulties.filter(v => v === a).length - difficulties.filter(v => v === b).length
    ).pop() || 'medium';

    const previousRecs = await db.collection<RecommendationDoc>('recommendations')
        .find({ userId: new ObjectId(userId) })
        .sort({ generatedAt: -1 })
        .limit(1)
        .toArray();

    let liked: string[] = [];
    let disliked: string[] = [];
    if (previousRecs.length > 0) {
        previousRecs[0].items.forEach(item => {
            if (item.feedback === true) liked.push(item.title);
            if (item.feedback === false) disliked.push(item.title);
        });
    }

    let items;
    if (env.USE_MOCK_AI === 'true') {
        items = mockRecommendations(topics, mostCommonDifficulty);
    } else {
        try {
            const prompt = buildRecommendationPrompt(topics, mostCommonDifficulty, liked, disliked);
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
            });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            items = JSON.parse(text);
        } catch (err: any) {
            console.error('Recommendation API error, using mock:', err.message);
            items = mockRecommendations(topics, mostCommonDifficulty);
        }
    }

    await db.collection<RecommendationDoc>('recommendations').insertOne({
        userId: new ObjectId(userId),
        items,
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return items;
}

function mockRecommendations(topics: string[], difficulty: string) {
    const sampleResources = [
        {
            title: `Complete ${topics[0] || 'Programming'} Guide`,
            url: 'https://www.coursera.org/',
            type: 'course',
            reason: `Comprehensive ${difficulty} level course covering all key concepts.`,
        },
        {
            title: `Effective ${topics[1] || topics[0] || 'Learning'} Techniques`,
            url: 'https://www.youtube.com/',
            type: 'video',
            reason: 'Hands‑on demonstrations and practical examples.',
        },
        {
            title: `Mastering ${topics[0] || 'Topics'} – Book`,
            url: 'https://www.amazon.com/',
            type: 'book',
            reason: 'In‑depth reference with exercises and projects.',
        },
        {
            title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Learning Path`,
            url: 'https://www.khanacademy.org/',
            type: 'article',
            reason: 'Curated roadmap with free resources.',
        },
        {
            title: 'Community Forum & Q&A',
            url: 'https://stackoverflow.com/',
            type: 'article',
            reason: 'Get answers to your specific questions.',
        },
    ];
    return sampleResources;
}

export async function submitFeedback(userId: string, recommendationTitle: string, liked: boolean) {
    const db = await getDb();
    await db.collection<RecommendationDoc>('recommendations').updateOne(
        {
            userId: new ObjectId(userId),
            'items.title': recommendationTitle,
            expiresAt: { $gt: new Date() },
        },
        {
            $set: { 'items.$.feedback': liked },
        }
    );
}