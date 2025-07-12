const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
dotenv.config();
const cors = require('cors');
const connectDB = require('./lib/db');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const messageRouter = require('./routes/messageRoutes');
const { Server } = require("socket.io");




const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
    cors: {origin: "*"}
})
const userSocketMap = {};
 // {userId: socketId}
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    console.log("User connected, ", userId);
    if(userId){
        userSocketMap[userId] = socket.id;
    } 
    //Emit onlone users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("User Disconnect", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
}) //socket.io connection handler
app.use(express.json({limit: "4mb"}));
app.use(cors());

app.use('/api/status', (req, res) => {
    res.status(200).json({
        message: "Server is running"
    })
})
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT || 5001;
server.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
}) 
module.exports = { io, userSocketMap };