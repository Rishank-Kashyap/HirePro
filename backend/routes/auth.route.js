import express from "express";
import {signup, login, logout} from "../controllers/auth.controller.js";

const userRoute = express.Router();

userRoute.route("/signup").post(signup);
userRoute.route("/login").post(login);
userRoute.route("/logout").post(logout);

export default userRoute;