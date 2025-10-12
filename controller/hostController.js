const Home=require('../model/home');

exports.getAddHome=(req, res, next) => {
  res.render('host/addHome', { pageTitle: 'Add Home to airbnb', currPage: 'addHome'});
};
exports.postAddHome = (req, res, next) => {

  const{houseName,price,Location,Rating,photoURL}=req.body;
  const newhome=new Home(houseName,price,Location,Rating,photoURL);
  newhome.save();
   const registeredHomes= Home.fetchAll();
  



  res.render('host/addedHome', {registeredHomes: registeredHomes, pageTitle: 'Home Added Successfully',altPageTitle: 'Home not Added successfully', currPage: 'homeAdded'});
};
exports.getAdminHomeList = (req, res, next) => {
  Home.fetchAll((registeredHomes) => {
    res.render('host/adminHomeList', {registeredHomes: registeredHomes, pageTitle: 'Admin Homes list', currPage: 'Admin-homes'});
  });
};



