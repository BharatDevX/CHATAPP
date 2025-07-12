const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
fullName: {
    type: String,
    required: true,
},
email: {
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    required: true,   
    minlength: 6,
},
profilePic: {
    type: String,
    default: "",
},
bio: {
    type: String,
    default: "Hi evryone, I am using Play & Chat",
},
},
{
    timestamps: true
}
)

module.exports = mongoose.model("User", userSchema);