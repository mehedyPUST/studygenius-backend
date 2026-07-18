import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
    MONGODB_URI: z.string().url(),
    MONGODB_DB_NAME: z.string(),
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GEMINI_API_KEY: z.string(),
    USE_MOCK_AI: z.string().optional().default('false'),
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),
    PORT: z.string().default('4000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data;