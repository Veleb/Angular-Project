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
      const { roomId } = data;

      socket.leave(roomId);
      
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

    socket.on('edit message', async (data) => {
      const { roomId, messageId, newMessage } = data;
     
      try {
        const updatedMessage = await messageService.editMessage(messageId, newMessage);
     
        io.to(roomId).emit('message edited', updatedMessage);
      } catch (error) {
        console.error('Error editing message:', error);
      }
    });

    socket.on('delete message', async ({roomId, messageId}) => {
      
      await messageService.deleteMessage(messageId);

      io.to(roomId).emit('message deleted', messageId);
    });

  });

}
