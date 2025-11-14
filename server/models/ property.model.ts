import mongoose, { Schema, Types } from 'mongoose';


export type PropertyStatus = 'available' | 'sold';


export interface IPriceDetails {
    price: number;
    currency: string;
}

export interface PropertyAttrs {
    title: string;
    amount: IPriceDetails;
    location: string;
    bedrooms: number;
    bathrooms: number;
    status: PropertyStatus;
}

export interface PropertyDocument extends mongoose.Document<Types.ObjectId> {
    title: string;
    amount: IPriceDetails;
    location: string;
    bedrooms: number;
    bathrooms: number;
    status: PropertyStatus;
}

const PropertySchema = new Schema<PropertyDocument>(
    {
        title: { type: String, required: true, trim: true, maxlength: 255 },
        location: { type: String, trim: true },
        amount: { 
            //in cents
            price: { type: Number, min: 0 },
            //currency with iso
            currency: { type: String }
        },
        bedrooms: { type: Number, min: 0 },
        bathrooms: { type: Number, min: 0 },
        status: {
            type: String,
            enum: ['available', 'sold'],
            default: 'available',
        },
    },
    {
        timestamps: true,
    },
);

// Optional indexes

const Property = mongoose.model<PropertyDocument>('Property', PropertySchema);

export default Property;