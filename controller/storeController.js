const Home = require('../model/home');
const favHomes=require('../model/favHomes');
exports.getHomes = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render('store/homesList', {registeredHomes: registeredHomes, pageTitle: 'Homes list', currPage: 'home'});
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
  favHomes.getFavourites((favourites) => {
    Home.fetchAll((registeredHomes) => {
      const favHomes = registeredHomes.filter(home => favourites.includes(home.id));
      res.render('store/favouriteList', {favHomes: favHomes, pageTitle: 'Favourites list', currPage: 'favourites', favourites: favourites});
    });
  });
};
exports.getHomeDetails=(req, res, next) => {
  const homeId=req.params.homeId;
  Home.fetchById(homeId, (home) => {
    if (home) {
      console.log('home found');
      res.render('store/homeDetail', { home: home, pageTitle: 'home-details', currPage: 'home' });
    } else {
      console.log('home not found');
      res.redirect('/homes');
    }
  });
};
exports.addToFavourites = (req, res, next) => {
  const homeId = req.body.homeId;
  favHomes.addFavourites(homeId, (err) => {
    if (err) {
      console.log('Error adding to favourites:', err);
      
    }
    
    res.redirect('/favourites');
  });
};
