

// External Module
const express = require('express');
const authRouter = express.Router();


// LocalModule
const authController=require("../controller/authController");
authRouter.get("/login",authController.getLogin);
authRouter.post("/auth/login",authController.postLogin);
authRouter.post("/logout",authController.postLogout);
authRouter.get("/signup",authController.getSignup);
authRouter.post("/auth/signup",authController.postSignUp);

module.exports=authRouter;
