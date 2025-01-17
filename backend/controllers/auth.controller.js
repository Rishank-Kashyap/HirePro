import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

export const signup = async (req, res) => {
    try {
        const {firstName, lastName, phoneNumber, emailId, password, role} = req.body;
        if(!firstName || !lastName){
            return res.status(400).json({
                message: "Please enter your Name.",
                success: false,
            });
        }
        else if(!validator.isMobilePhone(phoneNumber, 'en-IN')){
            return res.status(400).json({
                message: "Invalid phone number.",
                success: false,
            })
        }
        else if(!validator.isEmail(emailId)){
            return res.status(400).json({
                message: "Invalid email.",
                success: false,
            })
        }
        else if(!validator.isStrongPassword(password)){
            return res.status(400).json({
                message: "Enter a strong password",
                success: false,
            })
        }
        else if(!['student', 'recruitor'].includes(role)){
            return res.status(400).json({
                message: "Invalid role",
                success: false,
            })
        }

        const user = await User.findOne({emailId});
        if(user){
            return res.status(400).json({
                message: "User already exists. Please login",
                success: false,
            });
        };

        const hashedpassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName,
            lastName,
            phoneNumber,
            emailId,
            password: hashedpassword,
            role,
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    }
    catch(err) {
        console.log(err);
    }
};

export const login = async(req, res) => {
    try{
        const {emailId, password, role} = req.body;
        if(!emailId || !password || !role){
            return res.status(400).json({
                message: "Please fill all the fields.",
                success: false,
            });
        };

        const user = await User.findOne({emailId});
        if(!user){
            return res.status(400).json({
                message: "User not found. Please signup!",
                success: false,
            });
        };

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                message: "Invalid Password.",
                success: false,
            });
        };

        if(!["student", "recruitor"].includes(role)){
            return res.status(400).json({
                message: "Invalid role.",
                success: false,
            })
        }

        if(role !== user.role){
            return res.status(400).json({
                message: "Account doesn't exists with current role.",
                success: false,
            });
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {expiresIn: '1d'});

        return res.status(200)
                .cookie("token", token, {
                    maxAge: 1*24*60*60*1000,
                    httpsOnly:true, // This flag makes the cookie inaccessible to client-side JavaScript via document.cookie and prevents XSS attacks
                    //The cookie can only be sent to the server via HTTP requests
                    sameSite: 'strict' //due to this the cookie is sent only when the request comes from the same origin
                    // it prevents Cross-Site Request Forgery (CSRF) attacks
                })
                .json({
                    message: `Welcome back ${user.firstName}`,
                    user,
                    success: true,
                });
    }

    catch(err) {
        console.log(err);
    };
};

export const logout = async (req, res) => {
    try{
        return res.status(200).clearCookie("token").json({
            message: "Logged out successfully.",
            success: true,
        });
        // The clearCookie("token") code is used to clear a cookie named "token" by setting a new cookie with the same name ("token") but with an expired date. The browser receives the expired cookie and removes it.
    }
    catch(err) {
        console.log(err);
    }
}
