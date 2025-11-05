const Home=require('../model/home');
const User=require('../model/User');
const fs=require('fs');



exports.getAddHome=(req, res, next) => {
  console.log("Adding home");
  res.render('host/editHome', { pageTitle: 'Add Home', currPage: 'addHome',editing:false,isLoggedIn:req.isLoggedIn,User:req.session.User});
};

exports.getEditHome=(req, res, next) => {
  const homeId=req.params.homeId;
  const editing=req.query.editing==="true";
  console.log(homeId);
  console.log(editing);
  console.log("editing home");
  Home.findById(homeId).then(home => {
    if(!home){
      return res.redirect('/');
    }
    res.render('host/editHome', { pageTitle: 'Edit Home', currPage: 'Admin-homes', editing: editing, home: home ,isLoggedIn:req.isLoggedIn,User:req.session.User});
  }).catch(err => console.log(err));
};
exports.postEditHome = (req, res, next) => {
  
  
  const { homeId,houseName, price, Location, Rating,description } = req.body;

  Home.findById(homeId).then(home => {
    if (!home) {
      console.log("no home found for editing");
      return res.redirect('/');
    }


    home.houseName = houseName;
    home.price = price;
    home.location = Location;
    home.rating = Rating;
    home.description = description;
    if (req.files.photo && req.files.photo[0]) {
      fs.unlink(home.photo,(err)=>{
      if(err){
        console.log("error while deleting homes");

      }

      })
        home.photo = req.files.photo[0].path;
      }
      if (req.files.rules && req.files.rules.length > 0) {
  // Delete old rule files
  if (home.rules && home.rules.length > 0) {
    home.rules.forEach(ruleFile => {
      fs.unlink(ruleFile, err => {
        if (err) console.log("Error deleting old rule:", err);
      });
    });
  }

  // Save new rule files
  home.rules = req.files.rules.map(file => file.path);
}
    return home.save();
  }).then(() => {
    res.redirect('/host/admin-home-list');
  }).catch(err => console.log(err));
};
exports.postAddHome = (req, res, next) => {

  const{houseName,price,Location,Rating,description}=req.body;
  console.log(req.files.photo[0]);
  if(!req.files.photo[0]){
    console.log("no image provided");
    res.redirect('/host/add-home');
  }
  if(!req.files.rules[0]){
    console.log("no file of download  provided");
    res.redirect('/host/add-home');
  }
  const photo=req.files.photo[0].path;
  const rules=req.files.rules[0].path;
  const newhome=new Home({houseName,price,location:Location,rating:Rating,photo:photo,rules:rules,description});
  newhome.save().then(() => {
    console.log('Home added successfully');
  }).catch(err => {
    console.log('Error adding home:', err);
  });
  res.redirect('/host/admin-home-list');
    
   
  



 
};
exports.getAdminHomeList = (req, res, next) => {
  Home.find().then(registeredHomes => {
    res.render('host/adminHomeList', { registeredHomes: registeredHomes, pageTitle: 'Admin Home List', currPage: 'Admin-homes',isLoggedIn:req.isLoggedIn,User:req.session.User});
  }).catch(err => console.log(err));
};
exports.postDeleteHome = async (req, res, next) => {
  const homeId = req.params.homeId;
   const Userid=req.session.User._id;
    const User=await User.findById(Userid);
  await Home.deleteOne({ _id: homeId });
 
    if(User.favourites.includes(homeId)){
        User.favourites=User.favourites.filter(fav=>
          fav!=homeId);
      
        await User.save();
  
    }
  
  res.redirect('/host/admin-home-list');
};
  
 
