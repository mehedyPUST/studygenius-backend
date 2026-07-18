import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
    MONGODB_URI: z.string().url(),
    MONGODB_DB_NAME: z.string(),
    JWT_ACCESS_SECRET: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GEMINI_API_KEY: z.string(),
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),
    PORT: z.string().default('4000'),
    USE_MOCK_AI: z.string().optional().default('false'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    // Do NOT call process.exit() – it crashes Vercel serverless functions
}

// Use parsed data if valid, otherwise fall back to raw process.env
export const env = parsed.success ? parsed.data : (process.env as any);