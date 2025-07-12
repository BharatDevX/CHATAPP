const cloudinary = require("../lib/cloudinary");
const { generateToken } = require("../lib/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
exports.signup = async(req, res, next) => {
     const { fullName, email, password, bio } = req.body;
    try{
       if(!fullName || !email || !password){
        return res.json({
            success: false,
            message: "Missing details",
        })
    }
    const user = await User.findOne({email});
    if(user){
        return res.json({
            success: false,
            message: "Account already exists"
        });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
        bio: bio || "Hi everyone, I am using Play & Chat",
    });
    await newUser.save();
    const token = generateToken(newUser._id);
    res.json({
        success: true,
        userData: newUser,
        token,
        message: "Account created successfully",
    })
} catch(error){
    console.log("Error in signup: ", error);
    res.json({
        success: false,
        message: error.message,
    })
}
}

exports.login = async(req, res, next) => {
   const { email, password } = req.body;
   try{
    if(!email || !password){
        return res.json({
            success: false,
            message: "Missing details",
        })
    }
    const userData = await User.findOne({email});
    if(!userData){
        return res.json({
            success: false,
            message: "Account does not exist",
        })
    }
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if(!isPasswordValid){
        return res.json({
            success: false,
            message: "Invalid password",
        })
    }

    const token = generateToken(userData._id);
    res.json({
        success: true,
        userData,
        token,
        message: "Login successfully",
    })
   }catch(error){
    console.log("Error in login: ", error);
    res.json({
        success: false,
        message: error.message,
    })
   } 
}

exports.checkAuth = (req, res, next) => {
    res.json({
        success: true,
        user: req.user,
    })
}

exports.updateProfile = async(req, res) => {
   
    try{
         const { profilePic, bio, fullName } = req.body;
         const userId = req.user._id;
         let updatedUser;
        if(!profilePic){
           updatedUser = await User.findByIdAndUpdate(userId, {
            fullName,
            bio,
           }, {new: true})
        } else {
            const upload = await cloudinary.uploader.upload(profilePic) 
            updatedUser = await User.findByIdAndUpdate(userId, {
                profilePic: upload.secure_url,
                fullName,
                bio,
            }, {new: true})
        }
        await updatedUser.save();
        res.json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully",
        })
    }catch(error){
        console.log("Error in updateProfile: ", error);
        res.json({
            success: false,
            message: error.message,
        })
    }
}
