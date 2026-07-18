export function buildRecommendationPrompt(
    topics: string[],
    difficulty: string,
    liked: string[],
    disliked: string[]
): string {
    let base = `A student is studying the following topics: ${topics.join(', ')}, at a ${difficulty} difficulty level.`;

    if (liked.length > 0) base += ` They previously liked these resources: ${liked.join(', ')}.`;
    if (disliked.length > 0) base += ` They disliked these resources: ${disliked.join(', ')}. Please avoid similar ones.`;

    base += ` Recommend 5 high-quality free learning resources (such as online courses, YouTube videos, books, articles) that match their interests and learning level. For each resource provide: title, url, type (one of: course, video, book, article), and a short reason why it's recommended. Output as a JSON array of objects with keys: title, url, type, reason.`;

    return base;
}

// Also keep the plan content prompt if still needed
export function buildPlanContentPrompt(
    topic: string,
    difficulty: string,
    length: 'short' | 'medium' | 'long',
    previous?: object,
    refinement?: string
): string {
    let base = `You are an expert study planner and curriculum designer. Generate a detailed study plan for the topic "${topic}" at a "${difficulty}" difficulty level.`;
    if (length === 'short') base += ' Keep the entire response concise, about 150 words total.';
    else if (length === 'medium') base += ' Provide moderate detail, around 300 words.';
    else base += ' Provide comprehensive detail, around 500+ words.';
    base += ' Structure the output as JSON with the following fields: introduction (a 2-3 sentence overview), modules (an array of 3-5 objects with "title" and "topics" (array of strings)), summary (a 1-2 sentence closing note).';
    if (previous && refinement) {
        base += ` Here is the previous plan content: ${JSON.stringify(previous)}. Please refine it according to this instruction: "${refinement}". Keep the same JSON structure.`;
    }
    return base;
}