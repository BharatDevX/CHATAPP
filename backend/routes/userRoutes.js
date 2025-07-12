const express = require('express');
const userRouter = express.Router();

const userController = require('../controllers/userController');
const protectRoute = require('../middleware/auth');

userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.put('/update-profile', protectRoute,  userController.updateProfile);
userRouter.get('/check', protectRoute, userController.checkAuth);

module.exports = userRouter;

