import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/minicrm';

export async function connect(): Promise<typeof mongoose> {
    try {
        console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

        const connection = await mongoose.connect(MONGODB_URI);

        console.log('Connected to MongoDB successfully');
        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

export { mongoose };
