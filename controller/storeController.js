const Home = require('../model/home');
const favHomes=require('../model/favHomes');
exports.getHomes = (req, res, next) => {
 Home.fetchAll().then(([registeredHomes]) => {
    res.render('store/homesList', { registeredHomes: registeredHomes, pageTitle: 'All Homes', currPage: 'homes' });
  }).catch(err => console.log(err));
};
exports.getIndex = (req, res, next) => {
  Home.fetchAll().then(([registeredHomes]) => {
    res.render('store/index', { registeredHomes: registeredHomes, pageTitle: 'Airbnb Home', currPage: 'index' });
  }).catch(err => console.log(err));
};

exports.getBookings = (req, res, next) => {
  res.render('store/bookings', { pageTitle: 'Your Bookings', currPage: 'bookings' });
};
exports.getFavouriteList = (req, res, next) => {
  favHomes.getFavourites().then(([favHomes]) => {
    res.render('store/favouriteList', { favHomes: favHomes, pageTitle: 'Your Favourites', currPage: 'favourites' });
  }).catch(err => console.log(err));
};
exports.getHomeDetails=(req, res, next) => {
  const homeId=req.params.homeId;
  Home.fetchById(homeId).then(([homes]) => {
    const home=homes[0];
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
 favHomes.addFavourites(homeId).then((result) => {
   console.log(result.message);
   res.redirect('/homes');
 }).catch(err => {
   console.log('Error adding to favourites:', err);
   res.redirect('/favourites');
 });
};
exports.removeFromFavourites = (req, res, next) => {
  const homeId = req.params.homeId;
  favHomes.removeFavourites(homeId).then(() => {
    res.redirect('/favourites');
  }).catch(err => {
    console.log('Error removing from favourites:', err);
    res.redirect('/favourites');
  });
  
};
