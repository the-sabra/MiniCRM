import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const messages = { 
  required: 'The {{ field }} field is required',
}
const fields = {
    id: 'MongoDB ID',
}

vine.messagesProvider = new SimpleMessagesProvider(messages, fields)

export const MongoIDSchema = vine.object({
    id: vine.string().fixedLength(24).regex(/^[0-9a-fA-F]{24}$/),
});
