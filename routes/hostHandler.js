

// External Module
const express = require('express');
const hostRouter = express.Router();


// LocalModule
const hostController=require("../controller/hostController");
hostRouter.get("/add-home",hostController.getAddHome);

hostRouter.get("/edit-Home/:homeId",hostController.getEditHome);
hostRouter.post("/edit-Home/",hostController.postEditHome);
hostRouter.post("/deleteHome/:homeId",hostController.postDeleteHome);

hostRouter.post("/add-home",hostController.postAddHome );
hostRouter.get("/admin-home-list",hostController.getAdminHomeList );

module.exports=hostRouter;
