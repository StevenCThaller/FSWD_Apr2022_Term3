import { Schema, model } from 'mongoose';
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 25
  },
  passwordHash: {
    type: String,
    required: true
  },
  friends: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ],
  chatRooms: [
    {
      type: ObjectId,
      ref: 'ChatRoom'
    }
  ]
}, { timestamp: true })

const User = model('User', userSchema)

export default User