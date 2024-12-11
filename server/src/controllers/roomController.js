import { Router } from "express";
import roomService from "../services/roomService.js";
import userService from "../services/userService.js";
import messageService from '../services/messageService.js';

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
      const roomExists = await roomService.checkRoomExists(data.users, data.product);
      
      let room;

      if (!roomExists) {
          room = await roomService.createRoom(data);

          const addRoomPromises = data.users.map((userId) =>
            userService.addRoomToUser(userId, room._id)
          );
          
          await Promise.all(addRoomPromises);

      } else {
         room = await roomService.getRoomByUsers(data.users, data.product);
      }
      
      res.status(200).json(room);
      
  } catch (err) {
      console.error('Error handling room creation:', err);
      res.status(400).json({ message: `Error handling room creation: ${err.message}` });
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

roomController.delete('/delete/user', async (req, res) => {
  const userId = req.user?._id;
  
  try {
    
    const response = await roomService.removeUserFromRooms(userId);

    res.status(200).json(response);

  } catch (err) {
    res.status(400).json({ message: `Error deleting user's rooms: ${err}` });
  }
})

roomController.delete('/delete/user/messages', async (req, res) => {
  const userId = req.user?._id;
  
  try {
    
    const response = await messageService.removeUserMessages(userId);

    res.status(200).json(response);

  } catch (err) {
    res.status(400).json({ message: `Error deleting user's messages: ${err}` });
  }
})



export default roomController;