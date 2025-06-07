
import mongoose from "mongoose";

//createdat and updatedat fields will autmoatically be added in the schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastlogin: {
        type: Date,
        default: Date.now,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },
    resetpasswordToken: String,
    resetpasswordExpiresAt: Date,
    verificationToken:String,
    verificationExpiresAt: Date,  
}, {timestamps: true,});

export const User = mongoose.model("User", userSchema);