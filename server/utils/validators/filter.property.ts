import vine from '@vinejs/vine'



export const filterPropertySchema = vine.object({
    search: vine.string().minLength(3).maxLength(100).optional(),
    page: vine.number().min(1).optional(),
    take: vine.number().min(1).max(100).optional(),
});
