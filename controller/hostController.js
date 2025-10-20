const Home=require('../model/home');
const favHomes=require('../model/favHomes');


exports.getAddHome=(req, res, next) => {
  console.log("Adding home");
  res.render('host/editHome', { pageTitle: 'Add Home', currPage: 'addHome',editing:false});
};

exports.getEditHome=(req, res, next) => {
  const homeId=req.params.homeId;
  const editing=req.query.editing==="true";
  console.log(homeId);
  console.log(editing);
  console.log("editing home");
  Home.fetchById(homeId).then(([homes]) => {
    const home=homes[0];
    if (home) {
      res.render('host/editHome', { pageTitle: 'Edit Home', currPage: 'Admin-homes',editing: editing, home: home});
    }
    else{
      res.redirect('/host/admin-home-list');

    }
  });
};
exports.postEditHome = (req, res, next) => {
  
  
  const { homeId,houseName, price, Location, Rating, photoURL,description } = req.body;
  const updatedHome = new Home(houseName, price, Location, Rating, photoURL,description,homeId);
  updatedHome.save();
  updatedHome.id = homeId;


  
  res.redirect('/host/admin-home-list');
};
exports.postAddHome = (req, res, next) => {

  const{houseName,price,Location,Rating,photoURL,description}=req.body;
  const newhome=new Home(houseName,price,Location,Rating,photoURL,description);
  newhome.save().then(() => {
    console.log('Home added successfully');
    homeAdded=true;
     res.render('host/addedHome', {homeAdded:true, pageTitle: 'Home Added Successfully',altPageTitle: 'Home not Added successfully', currPage: 'homeAdded'});
  }).catch(err => {
    console.log('Error adding home:', err);
    homeAdded=false;
     res.render('host/addedHome', {homeAdded:false, pageTitle: 'Home Added Successfully',altPageTitle: 'Home not Added successfully', currPage: 'homeAdded'});
  });
   
  



 
};
exports.getAdminHomeList = (req, res, next) => {
  Home.fetchAll().then(([registeredHomes]) => {
    res.render('host/adminHomeList', {registeredHomes: registeredHomes, pageTitle: 'Admin Homes list', currPage: 'Admin-homes'});
  });
};
exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.deleteById(homeId).then(() => {
    
  }).catch(err => {
    console.log('Error deleting home:', err);
    res.redirect('/host/admin-home-list');
  });
 favHomes.removeFavourites(homeId).then(() => {
    res.redirect('/host/admin-home-list');
  }).catch(err => {
    console.log('Error removing from favourites during home deletion:', err);
    res.redirect('/host/admin-home-list');
  });
};
