const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const { default: mongoose } = require('mongoose');

const storeHandler = require('./routes/storeHandler');
const hostHandler = require('./routes/hostHandler');
const authHandler = require('./routes/authHandler');
const rootDir = require('./utils/pathUtil');
const errorController = require('./controller/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
const db ="mongodb+srv://root:root123@clustercoding.ieuzb3z.mongodb.net/airbnb?retryWrites=true&w=majority&appName=ClusterCoding" ;
const store = new MongoStore({ uri: db, collection: "sessions" });

// Sessions
app.use(session({
  secret: "dev_secret",
  resave: false,
  saveUninitialized: true,
  store: store
}));

// Multer Setup
const randomstring = (length) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photo") cb(null, "uploads");
    else if (file.fieldname === "rules") cb(null, "rules");
  },
  filename: (req, file, cb) => {
    cb(null, randomstring(10) + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype))
    cb(null, true);
  else cb(null, false);
};

app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage, fileFilter }).fields([{ name: 'photo' }, { name: 'rules' }]));
app.use(express.static(path.join(rootDir, 'public')));
app.use("/uploads", express.static(path.join(rootDir, 'uploads')));

// Session middleware
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

// Auth routes
app.use("/host", (req, res, next) => {
  if (!req.isLoggedIn) return res.redirect("/login");
  next();
});
app.use("/host", hostHandler);
app.use(authHandler);
app.use("/store", (req, res, next) => {
  if (!req.isLoggedIn && req.originalUrl !== "/store") return res.redirect("/login");
  next();
});
app.use("/store", storeHandler);

// Error handler
app.use(errorController.getError);

// DB + Start server
mongoose.connect(db)
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT =  3003;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log("Connection failed", err));
