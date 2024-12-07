import { Router } from "express";
import roomService from "../services/roomService.js";
import userService from "../services/userService.js";

const roomController = Router();

roomController.get('/', async (req, res) => {
  const userId = req.user?._id;

  try {

    const rooms = await userService.getUserRooms(userId); 
    
    res.status(200).json(rooms);

  } catch (err) {
    res.status(400).json({ message: `Error getting rooms: ${err}` });
  }
});

roomController.post('/', async (req, res) => {
  const data = req.body;
  
  try {
      const roomExists = await roomService.checkRoomExists(data.users);
      
      let room;

      if (!roomExists) {
          room = await roomService.createRoom(data);
      } else {
          room = await roomService.getRoomByUsers(data.users);
      }
      
      res.status(200).json(room);
  } catch (err) {
      console.error('Error handling room creation:', err);
      res.status(400).json({ message: `Error handling room creation: ${err.message}` });
  }
});

export default roomController;