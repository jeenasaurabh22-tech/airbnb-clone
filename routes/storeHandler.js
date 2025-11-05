

// External Module
const express = require('express');
const UserRouter = express.Router();

// Local Module

const storeController = require('../controller/storeController');




UserRouter.get("/", storeController.getIndex);
UserRouter.get("/bookings", storeController.getBookings);
UserRouter.get("/favourites", storeController.getFavouriteList);
UserRouter.get("/homes", storeController.getHomes);
UserRouter.get("/homes/:homeId", storeController.getHomeDetails);
UserRouter.post('/favourites', storeController.addToFavourites);
UserRouter.post('/favourites/deleteHome/:homeId', storeController.removeFromFavourites);
UserRouter.get("/rules/:homeId",storeController.getHoUserules);

module.exports = UserRouter;