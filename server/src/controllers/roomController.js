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

roomController.get('/:roomId', async (req, res) => {

  const roomId = req.params.roomId;

  try {

    const room = await roomService.getRoom(roomId); 
    
    res.status(200).json(room);

  } catch (err) {
    res.status(400).json({ message: `Error getting rooms: ${err}` });
  }
});

roomController.get('/:roomId/messages', async (req, res) => {

  const roomId = req.params.roomId;
  const limit = Number(req.query.limit) || 0;
  const skip = Number(req.query.skip) || 0;

  try {

    const messages = await roomService.getRoomMessages(roomId, limit, skip); 
    
    res.status(200).json(messages);

  } catch (err) {
    res.status(400).json({ message: `Error getting rooms: ${err}` });
  }
});

roomController.post('/', async (req, res) => {
  const data = req.body;
  
  try {
      const roomExists = await roomService.checkRoomExists(data.users, data.product);
      
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

roomController.put('/:roomId', async (req, res) => {
  const data = req.body;
  const roomId = req.params.roomId;

  try {
      const room = await roomService.editRoom(roomId, data);
      
      res.status(200).json(room);
  } catch (err) {
      console.error('Error handling room creation:', err);
      res.status(400).json({ message: `Error handling room creation: ${err.message}` });
  }
});

export default roomController;