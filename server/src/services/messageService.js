import Message from "../models/Message.js";

async function createMessage(data, user) {
  const newMessage = await Message.create({ text: data, sentBy: user });

  return newMessage;
};

async function editMessage(messageId, newData) {
  const updatedMessage = await Message.findByIdAndUpdate(
    messageId,
    { text: newData },
    { new: true }
  );

  return updatedMessage;
};

async function deleteMessage(messageId) {
  const updatedMessage = await Message.findByIdAndDelete(messageId);

  return updatedMessage;
};

const messageService = {
  createMessage,
  editMessage,
  deleteMessage,
  
};

export default messageService;
