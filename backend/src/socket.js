const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });

  io.on('connection', socket => {
    socket.on('join-user', userId => {
      socket.join(`user-${userId}`);
    });

    socket.on('join-chat', chatId => {
      socket.join(`chat-${chatId}`);
    });

    socket.on('send-message', data => {
      socket.to(`chat-${data.chatId}`).emit('new-message', data);
      io.to(`user-${data.receiverId}`).emit('notification', {
        type: 'message',
        text: 'New message received'
      });
    });

    socket.on('disconnect', () => {});
  });
};
