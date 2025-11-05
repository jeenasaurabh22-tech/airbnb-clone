const { check, validationResult } = require("express-validator");
const User=require("../model/User");
const bcrypt=require('bcryptjs');



exports.postLogout=(req,res)=>{
  req.session.destroy(()=>{
    res.redirect("/login");

  })

  
}
exports.getSignup = (req, res) => {
  res.render("auth/signup", {pageTitle: "Signup", currPage: "signup",isLoggedIn:req.isLoggedIn,errors:[],oldInput:{firstName:"",lastName:"",email:"",password:"",UserType:""},User:{}});
}
exports.postSignUp=[
  check('firstName')
    .notEmpty().withMessage('First name is required')
    .isAlpha().withMessage('First name must contain only letters')
    .trim()
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters long')
    .matches(/^[a-zA-Z]+$/).withMessage('First name must contain only letters'),
    check('lastName')
    .notEmpty().withMessage('Last name is required')
    .isAlpha().withMessage('Last name must contain only letters')
    .trim()
    .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long')
    .matches(/^[a-zA-Z]*$/).withMessage('Last name must contain only letters'),
    check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .custom((value)=>{
      return User.findOne({email:value}).then((newUser)=>{
        if(newUser){
          throw new Error("User already exists");
        }
        return true;

      })
    }),
    check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[\W]/).withMessage('Password must contain at least one special character')
    .trim(),
    check('confirmPassword')
    .notEmpty().withMessage('Confirm Password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    check('UserType')
    .notEmpty().withMessage('User type is required')
    .isIn(['guest', 'host']).withMessage('Invalid User type selected'),
    check('terms')
     .notEmpty()
  .withMessage("Please accept the terms and conditions")
    .custom((value, { req }) => {
      if (value !== 'on') {
        throw new Error('You must agree to the terms and conditions');
      }
      return true;
    }),
    (req,res)=>{
     const {firstName,lastName,email,password,UserType,terms}=req.body;
     console.log(req.body);
     const error=validationResult(req);
     if(!error.isEmpty()){
      return res.status(422).render("auth/signup",{
        pageTitle:"Signup",
        currPage:"signup",
        isLoggedIn:false,
        errors:error.array().map(err=>{
          return err.msg;
        }),
        oldInput:{
          firstName:firstName,
          lastName:lastName,
          email:email,
          password:password,
          UserType:UserType
        },User:{}
      });
    };

  
      
      
      bcrypt.hash(password,12).then(hashedPassword =>{
        const newUser=new User({firstName,lastName,email,password:hashedPassword,UserType,terms});
        return newUser.save();
        

      })
      .then(()=>{
        res.redirect('/login');
      })
      .catch(err =>{
        console.log(err);
      })
      
     
    }];
    exports.getLogin = (req, res) => {
  res.render("auth/login", {pageTitle: "Login", currPage: "login",isLoggedIn:false,errors:[],oldInput:{email:"",password:""},User:{}});
};
exports.postLogin= async (req,res)=>{
  const {email,password}=req.body;

 const user=await User.findOne({email:email})
 if(!user){
  return res.status(422).render("auth/login",{
        pageTitle:"Login",
        currPage:"login",
        isLoggedIn:false,
        errors:["User doesn't exist"],
        oldInput:{email},
        User:{}

    })

 }
 const isMatch=await bcrypt.compare(password,user.password);
 if(!isMatch){
return res.status(422).render("auth/login",{
        pageTitle:"Login",
        currPage:"login",
        isLoggedIn:false,
        errors:["invalid password"],
        oldInput:{email},
        User:{}

    })

 }

 
      
    req.session.isLoggedIn=true;
    req.session.User=user;
    await req.session.save();

    res.redirect("/store");

    
    
  }
  


