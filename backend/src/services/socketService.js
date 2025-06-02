import { Server } from 'socket.io';

class SocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.connectedUsers = new Map();
    this.initialize();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle user authentication
      socket.on('authenticate', (userId) => {
        this.connectedUsers.set(userId, socket.id);
        socket.userId = userId;
        console.log(`User ${userId} authenticated`);
      });

      // Handle garage availability updates
      socket.on('checkGarageAvailability', async (garageId) => {
        socket.join(`garage:${garageId}`);
      });

      // Handle booking updates
      socket.on('bookingUpdate', (data) => {
        this.io.to(`garage:${data.garageId}`).emit('bookingStatusChanged', data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
        }
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  // Notify users about garage availability changes
  notifyGarageAvailability(garageId, availability) {
    this.io.to(`garage:${garageId}`).emit('availabilityUpdate', {
      garageId,
      availability
    });
  }

  // Notify specific user about booking status
  notifyUser(userId, event, data) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Broadcast booking confirmation
  broadcastBookingConfirmation(garageId, bookingData) {
    this.io.to(`garage:${garageId}`).emit('bookingConfirmed', bookingData);
  }
}

export default SocketService;