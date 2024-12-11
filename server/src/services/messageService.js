import Message from "../models/Message.js";
import mongoose from "mongoose";

async function createMessage(data, senderId) {
  try {
    const newMessage = await Message.create({ text: data, sentBy: senderId });
    
    return newMessage;
    
  } catch (error) {
      throw new Error('Failed to create message');
  }
}

async function editMessage(messageId, newData) {
  const updatedMessage = await Message.findByIdAndUpdate(
    messageId,
    { text: newData },
    { new: true }
  );

  return updatedMessage;
}

async function deleteMessage(messageId) {

  const updatedMessage = await Message.findByIdAndDelete(messageId);

  return updatedMessage;
}

async function removeUserMessages(userId) {
  return Message.deleteMany({ sentBy: userId });
}

const messageService = {
  createMessage,
  editMessage,
  deleteMessage,
  removeUserMessages
};

export default messageService;
