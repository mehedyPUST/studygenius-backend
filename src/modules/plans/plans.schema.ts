import { z } from 'zod';

export const createPlanSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200),
    shortDescription: z.string().min(1).max(500),
    fullDescription: z.string().min(1),
    subject: z.string().min(1, 'Subject is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    estimatedHours: z.number().min(0.5),
    imageUrl: z.string().url().optional().or(z.literal('')),
    modules: z
        .array(
            z.object({
                title: z.string(),
                topics: z.array(z.string()),
            })
        )
        .optional(),
    aiGenerated: z.boolean().default(false),
});

export const updatePlanSchema = createPlanSchema.partial();

export const reviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(1).max(1000),
});

export const planQuerySchema = z.object({
    search: z.string().optional(),
    subject: z.string().optional(),
    difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    minRating: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : undefined)),
    sortBy: z.enum(['newest', 'rating', 'hours']).default('newest'),
    page: z
        .string()
        .default('1')
        .transform((val) => Math.max(1, parseInt(val, 10) || 1)),
    limit: z
        .string()
        .default('12')
        .transform((val) => Math.min(50, Math.max(1, parseInt(val, 10) || 12))),
});