const cloudinary = require("../lib/cloudinary");
const Message = require("../models/message");
const User = require("../models/User");
const { io, userSocketMap } = require("../server");

exports.getUsersForSidebar = async(req, res) => {
    try{
        const userId = req.user._id;
        const filterUsers = await User.find({_id: {
            $ne: userId
        }}).select("-password");
        const unseenMessages = {};
        const promises = filterUsers.map(async(user) => {
            const lastMessage = await Message.find({senderId: user._id, receiverId: userId, seen: false});
            if(lastMessage.length > 0){
                unseenMessages[user._id] = lastMessage.length;
            }
        })
        await Promise.all(promises);
        res.json({
            success: true,
            users: filterUsers,
            unseenMessages,
        })
    }catch(error){
        console.log("Error in getUsersForSidebar: ", error);
        res.json({
            success: false,
            message: error.message,
        })
    }
}

exports.getMessages = async(req, res) => {
    try{
        const { id: selectedUserId } = req.params;
        const userId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId: userId, receiverId: selectedUserId},
                {
                    senderId: selectedUserId,
                    receiverId: userId
                }
            ]
        })
        await Message.updateMany({
            senderId: selectedUserId,
            receiveId: userId,
        }, {seen: true});
        res.json({
            success: true,
            messages
        })

    }catch(error){
        console.log("Error in getMessages: ", error);
        res.json({
            success: false, 
            message: error.message,
        })  
    }
}

exports.markMessageAsSeen = async(req, res) => {
    try{
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, {seen: true});
        res.json({
            success: true,
        })
    }catch(error){
        console.log("Error in markMessageAsSeen: ", error);
        res.json({
            success: false, 
            message: error.message, 
        })
    }
}

exports.sendMessage = async(req, res) => {
    try{
        const { text, image } = req.body;
        const senderId = req.user._id;
        const receiverId = req.params.id;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })
        await newMessage.save()

        const receiverSocketId = userSocketMap?.[receiverId];

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({
            success: true,
            newMessage,
            message: "Message send"
        })
    }catch(error){
        console.log("Error in sendMessage: ", error);

        res.json({
            success: false, 
            message: error.message, 
        })
    }
}