//Socket.io
import { createServer } from 'http';
import { Server } from 'socket.io';

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import roleRoutes from './routes/role.route.js';
import projectRoutes from './routes/project.route.js';
import ticketTypeRoutes from './routes/ticketType.route.js';
import userRoutes from "./routes/user.route.js";
import ticketRoutes from "./routes/ticket.route.js";
import commentRoutes from "./routes/comment.route.js";
import { handleError, routeNotFound, authMiddleware } from './middleware/middleware.js';

const app = express();

const server = createServer(app);  // Create a HTTP server
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    // Example of listening to and emitting messages
    socket.on('message', (message) => {
        io.emit('message', message);
    });
});

//preconfigure express app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Middleware
app.get("/", (_, res) => res.send("Welcome to TrackMaster API"));
app.use('/auth', authRoutes);
app.use('/user', authMiddleware, userRoutes);
app.use('/role', authMiddleware, roleRoutes);
app.use('/project', authMiddleware, projectRoutes);
app.use('/comment', authMiddleware, commentRoutes);
app.use('/ticket', authMiddleware, ticketRoutes);
app.use('/ticketType', authMiddleware, ticketTypeRoutes);

app.use(handleError);
app.use(routeNotFound);

export default app;