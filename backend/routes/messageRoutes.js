const express = require("express");

const messageRouter = express.Router();

const messageController = require("../controllers/messageController");
const protectRoute = require("../middleware/auth");

messageRouter.get("/users", protectRoute, messageController.getUsersForSidebar);
messageRouter.get("/:id", protectRoute, messageController.getMessages);
messageRouter.put("/mark/:id", protectRoute, messageController.markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, messageController.sendMessage);


module.exports = messageRouter;