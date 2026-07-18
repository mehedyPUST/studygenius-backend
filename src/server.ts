import { createApp } from './app';
import { getDb, closeDb } from './lib/mongodb';
import { env } from './config/env';

async function start() {
    await getDb();
    console.log('✅ Connected to MongoDB');

    const app = createApp();
    app.listen(env.PORT, () => {
        console.log(`🚀 Server running on http://localhost:${env.PORT}`);
    });

    process.on('SIGINT', async () => {
        await closeDb();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        await closeDb();
        process.exit(0);
    });
}

start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});