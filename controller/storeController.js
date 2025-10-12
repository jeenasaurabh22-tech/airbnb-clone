const Home = require('../model/home');

exports.getHomes = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render('store/homePage', {registeredHomes: registeredHomes, pageTitle: 'Homes list', currPage: 'home'});
  });
};
exports.getIndex = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render('store/index', {registeredHomes: registeredHomes, pageTitle: 'Airbnb Home', currPage: 'index'});
  });
};

exports.getBookings = (req, res, next) => {
  res.render('store/bookings', { pageTitle: 'Your Bookings', currPage: 'bookings' });
};
exports.getFavouriteList = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render('store/favouriteList', {registeredHomes: registeredHomes, pageTitle: 'Favourites list', currPage: 'favourites'});
  });
};



