import { Schema, model, Types } from "mongoose";

const messageSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  sentBy: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  }
}, { timestamps: { createdAt: 'created_at' } });

const Message = model("Message", messageSchema);

export default Message;

// ✔️