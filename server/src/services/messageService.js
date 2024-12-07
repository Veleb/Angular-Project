import Message from "../models/Message.js";

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

const messageService = {
  createMessage,
  editMessage,
  deleteMessage,
};

export default messageService;
