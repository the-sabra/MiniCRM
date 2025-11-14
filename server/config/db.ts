import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/minicrm';

export async function connect(): Promise<typeof mongoose> {
    try {
        console.log(`Connecting to MongoDB at: ${MONGODB_URI}`);

        const connection = await mongoose.connect(MONGODB_URI);

        console.log('Connected to MongoDB successfully');
        
        // make global define to edit _id to be id and delete __v
        mongoose.set('toJSON', {
            transform: (_doc: any, ret : any) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            },
        });

        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

export { mongoose };
