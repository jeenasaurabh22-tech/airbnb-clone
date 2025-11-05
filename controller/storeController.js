const Home = require('../model/home');
const User=require('../model/User');
exports.getHomes = (req, res, next) => {
 Home.find().then(registeredHomes => {
    res.render('store/homesList', { registeredHomes: registeredHomes, pageTitle: 'Homes list', currPage: 'home', isLoggedIn:req.isLoggedIn,User:req.session.User });
  }).catch(err => console.log(err));
};
exports.getIndex = (req, res, next) => {
  console.log(req.session);
 Home.find().then(registeredHomes => {
    res.render('store/index', { registeredHomes: registeredHomes, pageTitle: 'Airbnb Home', currPage: 'index',isLoggedIn:req.isLoggedIn ,User:req.session.User});
  }).catch(err => console.log(err));
};

exports.getBookings = (req, res, next) => {
  res.render('store/bookings', { pageTitle: 'Your Bookings', currPage: 'bookings',isLoggedIn:req.isLoggedIn,User:req.session.User });
};
exports.getFavouriteList = async (req, res, next) => {
  // Home.find().then(registeredHomes => {
  //   favHomes.find().then(favHomesList => {
  //     const favouriteHomes = registeredHomes.filter(home => {
  //       return favHomesList.some(favHome => favHome.homeId.toString() === home._id.toString());
  //     });
  //     res.render('store/favouriteList', { favouriteHomes: favouriteHomes, pageTitle: 'Your Favourites', currPage: 'favourites' });
  //   }).catch(err => console.log(err));
  // });
  const Userid=req.session.User._id;
  const user= await User.findById(Userid).populate('favourites');
   res.render('store/favouriteList', { favHomes: user.favourites, pageTitle: 'Your Favourites', currPage: 'favourites',isLoggedIn:req.isLoggedIn,User:req.session.User });
 

};

exports.getHomeDetails=(req, res, next) => {
  const homeId=req.params.homeId;
  Home.findById(homeId).then(home => {
    if (home) {
      console.log('home found');
      res.render('store/homeDetail', { home: home, pageTitle: 'home-details', currPage: 'home' ,isLoggedIn:req.isLoggedIn,User:req.session.User });
    } else {
      console.log('home not found');
      res.redirect('/store/homes');
    }
  }).catch(err => console.log(err));
};
exports.addToFavourites = async (req, res, next) => {
  const homeId = req.body.homeId;
  const Userid=req.session.User._id;
  const user=await User.findById(Userid);
  if(!user.favourites.includes(homeId)){
      user.favourites.push(homeId);
      await user.save();

  }
  res.redirect('/store/favourites');



};
exports.removeFromFavourites = async (req, res, next) => {
  const homeId = req.params.homeId;
  const Userid=req.session.User._id;
  const user=await User.findById(Userid);
  if(user.favourites.includes(homeId)){
      user.favourites=user.favourites.filter(fav=>
        fav!=homeId);
    
      await user.save();

  }
   res.redirect('/store/favourites');

  
};
exports.getHoUserules = async (req, res) => {
  try {
    const home = await Home.findById(req.params.homeId);

    if (!home || !home.rules || home.rules.length === 0) {
      return res.send("No rules uploaded");
    }

    return res.download(home.rules[home.rules.length - 1]);

  } catch (err) {
    console.log(err);
    res.redirect('/store/homes');
  }
};
