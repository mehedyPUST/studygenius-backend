import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env';
import { AppError } from '../../middlewares/errorHandler';
import { buildPlanContentPrompt } from '../../utils/prompts';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export async function generatePlanContent(input: {
    topic: string;
    shortDescription?: string;
    difficulty: string;
    outputLength: 'short' | 'medium' | 'long';
    previousOutput?: object;
    refinementInstruction?: string;
}) {
    // If USE_MOCK_AI is true, return realistic mock data
    if (env.USE_MOCK_AI === 'true') {
        return mockGeneratePlanContent(input);
    }

    const prompt = buildPlanContentPrompt(
        input.topic,
        input.difficulty,
        input.outputLength,
        input.previousOutput,
        input.refinementInstruction
    );

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
            maxOutputTokens: input.outputLength === 'short' ? 300 : input.outputLength === 'medium' ? 600 : 1000,
        },
    });

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const parsed = JSON.parse(text);
        return parsed;
    } catch (err: any) {
        // If quota exceeded or other error, fallback to mock
        console.error('Gemini error, using mock fallback:', err.message);
        return mockGeneratePlanContent(input);
    }
}

// Realistic mock generator
function mockGeneratePlanContent(input: { topic: string; difficulty: string; outputLength: string; refinementInstruction?: string }) {
    const { topic, difficulty, outputLength, refinementInstruction } = input;
    const lengthFactor = outputLength === 'short' ? 1 : outputLength === 'medium' ? 2 : 3;

    const intro = `${topic} is a fascinating subject that becomes especially rewarding at a ${difficulty} difficulty level. This study plan is designed to build a strong foundation through clear concepts and hands‑on practice.`;
    const summary = `By following this plan, you'll gain a solid grasp of ${topic} and be prepared to tackle more advanced material.`;

    const modules = [
        {
            title: `Understanding ${topic} Basics`,
            topics: ['Key terminology', 'Core principles', 'Historical context'].slice(0, lengthFactor),
        },
        {
            title: `Practical Applications of ${topic}`,
            topics: ['Real‑world examples', 'Common pitfalls', 'Best practices'].slice(0, lengthFactor),
        },
        {
            title: `Advanced ${topic} Concepts`,
            topics: ['Deep dive into advanced techniques', 'Research trends', 'Future outlook'].slice(0, lengthFactor),
        },
    ];

    // If refinement provided, adjust the output slightly
    if (refinementInstruction) {
        return {
            introduction: `${intro} (Refined with: "${refinementInstruction}")`,
            modules,
            summary: `${summary} (Updated per refinement)`,
        };
    }

    return { introduction: intro, modules, summary };
}