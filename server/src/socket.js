import messageService from "./services/messageService.js";
import roomService from "./services/roomService.js";
import userService from "./services/userService.js";

export default function handleSocket(io) {

  io.on("connection", (socket) => {

    const currentUrl = socket.handshake.query.currentUrl;
      
    if (!currentUrl.includes('/chat')) {
      socket.disconnect(true);  
      return;
    }

    socket.on("join room", async (data) => {
      const { roomId, userId } = data;

      socket.join(roomId);

      await userService.addRoomToUser(userId, roomId);

      io.to(roomId).emit('room joined', roomId);
    });

    socket.on("leave room", async (data) => {
      const { roomId, userId } = data;

      socket.leave(roomId);

      await userService.removeRoomFromUser(userId, roomId);

      io.to(roomId).emit('room left', roomId);
    });

    socket.on("send message", async (data) => {
      const { roomId, message, senderId } = data;
      
      const sentMessage = await messageService.createMessage(
        message,
        senderId,
      );
      
      await roomService.addMessageToRoom(sentMessage._id, roomId);

      io.to(roomId).emit(`message sent`, sentMessage);
    });

    socket.on('edit message', async (roomId, messageId, data) => {
      const updatedMessage = await messageService.editMessage(messageId, data);

      io.to(roomId).emit(`message edited`, updatedMessage);
    });

    socket.on('delete message', async (roomId, messageId) => {
      await messageService.deleteMessage(messageId);

      io.to(roomId).emit('message deleted');
    });

  });

}
