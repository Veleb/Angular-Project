import { Schema, Types, model } from 'mongoose';

const roomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  messages: [
    {
      type: Types.ObjectId,
      ref: "Message"
    }
  ],
  users: [
    {
      type: Types.ObjectId,
      ref: "User"
    }
  ],
  owner: {
    type: Types.ObjectId,
    ref: "User",
  },
}, { timestamps: { createdAt: 'created_at' } });

const Room = model("Room", roomSchema);

export default Room;

// ✔️