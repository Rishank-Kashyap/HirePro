import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import validator from "validator";

export const updateProfile = async (req, res) => {
    try{
        const allowedEditFields = ["firstName", "lastName", "profile"];

        const disallowedFields = Object.keys(req.body).filter((key)=>!allowedEditFields.includes(key));

        if(disallowedFields.length>0){
            return res.status(400).json({
                message: `Updating ${disallowedFields.join(", ")} is not allowed`,
                status: false,
            });
        }
        
        const loggedInUserId = req.id; //coming from auth.js
        const loggedInUser = await User.findById(loggedInUserId);

        if(!loggedInUser){
            return res.status(400).json({
                message: "User not found.",
                success: false,
            })
        }

        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));

        await loggedInUser.save();

        return res.status(200).json({
            message: `${loggedInUser.firstName} your profile is updated successfully.`,
            loggedInUser,
            success: true,
        })
    }
    catch(err) {
        console.log(err);
    }
}

export const changePassword = async (req, res) => {
    try{
        const {currentPassword, newPassword} = req.body.password;
        const userId=req.id;
        const loggedInUser = await User.findById(userId);
        const iscurrentPasswordCorrect = await bcrypt.compare(currentPassword, loggedInUser.password);

        if(!iscurrentPasswordCorrect){
            return res.status(400).json({
                message: "Incorrect password",
                success: false,
            })
        }

        if(!validator.isStrongPassword(newPassword)){
            return res.status(400).json({
                message: "Enter a Strong Password",
                success: false,
            })
        }

        loggedInUser.password = await bcrypt.hash(newPassword, 10);
        await loggedInUser.save();

        return res.send(200).json({
            message: "Password updated successfully",
            success: true,
        })
    }
    catch(err) {
        console.log(err);
    }
}