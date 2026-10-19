import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        maxLength: 50
    }, 
    email: {
        required: true,
        type: String,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    passwordHash: {
        required: true,
        type: String,
    },
    phoneNumber: {
        required: true,
        type: String,
        unique: true,
        match: /^(\+91[\-\s]?)?[6789]\d{9}$/
    },
    role: {
        required: true,
        type: String,
        default: "user",
        enum: ["user", "seller"]
    },
    refreshToken: {
        type: String
    }
});

const userModel = mongoose.model("/user", userSchema)

export default userModel