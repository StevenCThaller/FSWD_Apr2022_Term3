import { Schema, model } from 'mongoose';
const { ObjectId } = Schema.Types;

const chatRoomSchema = new Schema({
  members: [{ type: ObjectId, ref: 'User' }],
  messages: [
    {
      from: {
        type: ObjectId,
        ref: 'User'
      },
      body: {
        type: String,
        required: true
      }
    }
  ]
}, { timestamps: true })

const ChatRoom = model('ChatRoom', chatRoomSchema)

export default ChatRoom