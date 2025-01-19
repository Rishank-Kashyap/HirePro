import express from "express";
import {updateProfile, changePassword} from "../controllers/profile.controller.js";
import userAuth from "../middlewares/auth.js";

const profileRoute = express.Router();

profileRoute.route("/update").patch(userAuth, updateProfile);
profileRoute.route("/changePassword").patch(userAuth, changePassword);

export default profileRoute;