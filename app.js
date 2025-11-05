const express=require('express');
const path=require('path');
const session=require('express-session');
const mongostore=require('connect-mongodb-session')(session);
const storeHandler=require('./routes/storeHandler');
const hostHandler=require('./routes/hostHandler');
const authHandler=require('./routes/authHandler');
const rootDir=require('./utils/pathUtil');
const errorController=require('./controller/error');
const app=express();
const {default:mongoose}=require('mongoose');
const db="mongodb+srv://root:root123@clustercoding.ieuzb3z.mongodb.net/airbnb?retryWrites=true&w=majority&appName=ClusterCoding";
const multer=require('multer');



app.set('view engine','ejs');
app.set('views','views');
const store=new mongostore({
    uri:db,
    collection:"sessions"
});

app.use(session({
    secret:"mysecret",
    resave:false,
    saveUninitialized:true,
    store:store
}));
const randomstring = (length) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for(let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photo") {
      cb(null, "uploads");
    } else if (file.fieldname === "rules") {
      cb(null, "rules");
    }
  },

  filename: (req, file, cb) => {
    cb(null, randomstring(10) + '-' + file.originalname);
  }
});


const fileFilter=(req,file,cb)=>{
    if(file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'||file.mimetype=='image/png'||file.mimetype==='application/pdf'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }

}

const multerOptions = { storage, fileFilter };


app.use(express.urlencoded({extended:true}));
app.use(multer(multerOptions).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'rules', maxCount: 1 }
]));
app.use(express.static(path.join(rootDir, 'public')))
app.use("/uploads",express.static(path.join(rootDir, 'uploads')));
app.use("/host/uploads",express.static(path.join(rootDir, 'uploads')));
app.use("/store/uploads",express.static(path.join(rootDir, 'uploads')));
app.use("/store/homes/uploads",express.static(path.join(rootDir, 'uploads')));
app.use((req,res,next)=>{
    req.isLoggedIn=req.session.isLoggedIn;
    next();
})

app.use("/host",(req,res,next)=>{
    if(!req.isLoggedIn){
        return res.redirect("/login");
    }
    next();
})
app.use("/host",hostHandler);
app.use(authHandler);

app.use("/store",(req,res,next)=>{
    if(!req.isLoggedIn&&req.originalUrl!=="/store"){
        return res.redirect("/login");
    }
    next();
})
app.use("/store",storeHandler);



app.use(errorController.getError);

mongoose.connect("mongodb+srv://root:root123@clustercoding.ieuzb3z.mongodb.net/airbnb?retryWrites=true&w=majority&appName=ClusterCoding").then(()=>{
    console.log("connected to mongodb");
    app.listen(3003,()=>{
        console.log('server started on port 3003');
    })
    
}).catch((err)=>{
    console.log("connection failed",err);
});

