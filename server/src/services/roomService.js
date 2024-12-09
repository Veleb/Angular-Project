import Room from "../models/Room.js";
import mongoose from "mongoose";

async function createRoom(data) { // ✔️
  const { name, users, owner, product } = data;

  try {

    const room = await Room.create({ name, users, owner, messages: [], product })
    
    return room;

  } catch (err) {
    throw new Error(`Error occurred while creating a room: ${err}`);
  }
}

async function getRoom(roomId) {
  try {

    const room = await Room.findById(roomId).lean();
    
    return room;

  } catch (err) {
    throw new Error(`Error occurred while fetching room: ${err}`);
  }
}

async function editRoom(roomId, data) {
  try {

    const room = await Room.findByIdAndUpdate(roomId, data, { new: true }).lean();
    
    return room;

  } catch (err) {
    throw new Error(`Error occurred while updating room: ${err}`);
  }
}

async function getRoomMessages(roomId, limit, skip) {
  try {
    const room = await Room.findById(roomId)
      .populate({
        path: 'messages',
        options: {
          limit: limit,
          skip: skip,    
          sort: { createdAt: -1 },
        }
      })
      .lean();

    return room ? room.messages : [];

  } catch (err) {
    throw new Error(`Error occurred while fetching room messages: ${err}`);
  }
}

async function addMessageToRoom(messageId, roomId) { // ✔️
  try {
    const room = await Room.findByIdAndUpdate(
      roomId,
      { $addToSet: { messages: new mongoose.Types.ObjectId(messageId) } },
      { new: true }
    );

    return room;

  } catch (err) {
    throw new Error(`Error occurred while saving message: ${err}`);
  }
};

async function checkRoomExists(users, productId) {
  try {
    const userObjectIds = users.map(userId => new mongoose.Types.ObjectId(userId));

    const room = await Room.findOne({
      users: { $all: userObjectIds },
      product: productId
    });

    return room ? true : false;

  } catch (err) {
    throw new Error(`Error checking room: ${err}`);
  }
}

async function getRoomByUsers(users) {
  try {

    const userObjectIds = users.map(userId => new mongoose.Types.ObjectId(userId));
    
    const room = await Room.findOne({
      users: { $all: userObjectIds }
    });
    
    return room;

  } catch (err) {
    throw new Error(`Error checking room: ${err}`);
  }
}

const roomService = {
  addMessageToRoom,
  createRoom,
  editRoom,
  checkRoomExists,
  getRoomByUsers,
  getRoom,
  getRoomMessages,

};

export default roomService;
