import { Schema, model } from 'mongoose';
const { ObjectId } = Schema.Types;

const friendRequestSchema = new Schema({
  from: {
    type: ObjectId,
    ref: 'User'
  },
  to: {
    type: ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "accepted", "ignored", "blocked"]
  }
}, { timestamps: true })

const FriendRequest = model('FriendRequest', friendRequestSchema)

export default FriendRequest