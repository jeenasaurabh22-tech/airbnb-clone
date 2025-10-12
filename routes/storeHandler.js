

// External Module
const express = require('express');
const userRouter = express.Router();

// Local Module

const storeController = require('../controller/storeController');




userRouter.get("/", storeController.getIndex);
userRouter.get("/bookings", storeController.getBookings);
userRouter.get("/favourites", storeController.getFavouriteList);
userRouter.get("/homes", storeController.getHomes);
userRouter.get("/homes/:homeId", storeController.getHomeDetails);
userRouter.post('/favourites', storeController.addToFavourites);

module.exports = userRouter;