import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: {
            values: ["student", "recruitor"],
            message: '{VALUE} is not a valid role',
        },
        required: true,
    },
    profile: {
        bio: {type: String},
        skills: {type: [String]},
        resumeOriginalName: {type: String},
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Company"
        },
        profilePhoto: {
            type: String,
            default: "https://www.inforwaves.com/media/2021/04/dummy-profile-pic-300x300-1.png"
        }
    }
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);