import { z } from 'zod';

export const generatePlanContentSchema = z.object({
    topic: z.string().min(1, 'Topic is required'),
    shortDescription: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    outputLength: z.enum(['short', 'medium', 'long']).default('medium'),
    previousOutput: z.any().optional(),
    refinementInstruction: z.string().optional(),
});