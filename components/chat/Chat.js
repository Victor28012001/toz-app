import socket from '../../utils/socket.js';
import { handleIncomingMessage } from '../ui/chat/chatUI.js';
import { removeRecentChatFromUI } from '../ui/chat/chatUI.js'; // <-- ensure this is exported

// Emit functions
export const joinRoom = (playerId) => {
  socket.emit('join', playerId);
};

export const createChatroom = (roomName, createdBy) => {
  socket.emit('createChatroom', { roomName, createdBy });
};

export const joinChatroom = (roomName, password = "") => {
  socket.emit("joinChatroom", { roomName, password });
};


export const sendRoomMessage = (roomId, sender, message) => {
  socket.emit('sendRoomMessage', { roomId, sender, message });
};

export const pinMessage = (roomId, messageId) => {
  socket.emit('pinMessage', { roomId, messageId });
};

export const deleteChatroom = (roomId) => {
  socket.emit('deleteChatroom', { roomId });
};

export const typing = (to, from) => {
  socket.emit('typing', { to, from });
};

export const typingInRoom = (roomId, from) => {
  socket.emit('typingInRoom', { roomId, from });
};

export const markRoomAsRead = (roomId, playerId) => {
  socket.emit('markRoomAsRead', { roomId, playerId });
};

export const sendPrivateMessage = (to, from, message) => {
  socket.emit('sendPrivateMessage', { to, from, message });
};

export const markPrivateMessagesAsRead = (senderId, recipientId) => {
  socket.emit('markPrivateMessagesAsRead', { senderId, recipientId });
};

export const reactToRoomMessage = (messageId, emoji, userId) => {
  socket.emit('reactToRoomMessage', { messageId, emoji, userId });
};

export const reactToPrivateMessage = (messageId, emoji, userId) => {
  socket.emit('reactToPrivateMessage', { messageId, emoji, userId });
};

// Listener setup
export const setupListeners = (playerId) => {
  socket.on('roomMessageReceived', (message) => {
    console.log('Room message received:', message);
    // Optional UI handler
  });

  socket.on('privateMessageReceived', (message) => {
    console.log('Private message received:', message);
    handleIncomingMessage(message);
  });

  socket.on('messagesMarkedAsRead', ({ senderId, recipientId }) => {
    console.log(`Messages from ${senderId} to ${recipientId} marked as read`);
    removeRecentChatFromUI(senderId); // remove unread indicator
  });

  socket.on('roomMessageReaction', ({ messageId, emoji, userId }) => {
    console.log(`User ${userId} reacted with ${emoji} to message ${messageId}`);
  });

  socket.on('privateMessageReaction', ({ messageId, emoji, userId }) => {
    console.log(`User ${userId} reacted with ${emoji} to private message ${messageId}`);
  });

  socket.on('typingReceived', ({ from }) => {
    console.log(`${from} is typing...`);
  });

  socket.on('roomTypingReceived', ({ roomId, from }) => {
    console.log(`${from} is typing in room ${roomId}`);
  });

  socket.on('chatroomsUpdated', (chatrooms) => {
    console.log('Available chatrooms:', chatrooms);
    // update UI dropdown/list here
  });

  socket.emit('join', playerId); // auto join socket
};
