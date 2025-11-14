import vine from '@vinejs/vine'



export const createPropertySchema = vine.object({
    title: vine.string().minLength(3).maxLength(100),
    amount: vine.object({
        price: vine.number().min(0).nonNegative().withoutDecimals(),
        currency: vine.string().fixedLength(3),
    }),
    location: vine.string().minLength(5).maxLength(255),
    bedrooms: vine.number().min(1),
    bathrooms: vine.number().min(1),
    //default to 'available' if not provided
    status: vine.enum(['available', 'sold']).nullable().optional(),
});
