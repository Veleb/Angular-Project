import Room from "../models/Room.js";
import mongoose from "mongoose";

async function createRoom(data) { // ✔️
  const { name, users, owner } = data;

  try {

    const room = await Room.create({ name, users, owner, messages: [] })
    
    return room;

  } catch (err) {
    throw new Error(`Error occurred while creating a room: ${err}`);
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

async function checkRoomExists(users) {
  try {

    const userObjectIds = users.map(userId => new mongoose.Types.ObjectId(userId));
    
    const room = await Room.findOne({
      users: { $all: userObjectIds }
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
  checkRoomExists,
  getRoomByUsers,
  
};

export default roomService;
