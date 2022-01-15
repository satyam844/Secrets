//jshint esversion:6
require("dotenv").config();
const express= require("express");
const bodyParser = require("body-parser");
const  ejs = require("ejs");
const mongoose = require("mongoose");
const  encrypt = require("mongoose-encryption");
const e = require("express");
const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine' , 'ejs');
app.use(express.static('public'));
mongoose.connect("mongodb://localhost:27017/userDB");

const  userSchema = new mongoose.Schema({
    email : String,
    password : String
});

// for encryption 

userSchema.plugin(encrypt,{secret :process.env.SECRET,encryptedFields: ['password']});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
})
 
app.get("/login",function(req,res){
    res.render("login");
}) 

app.get("/register",function(req,res){

    res.render("register");
})
app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email : username },function(err,foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                if(password === foundUser.password){
                    res.render("secrets");
                }
                else{
                    console.log("Invalid Password or id");
                }
            }
        }
    }) 
})
app.post("/register",function(req,res){
  const newUser = new User({
      email : req.body.username,
      password : req.body.password
  })
  newUser.save(function(err){
      if(err){
          console.log(err);
      }
      else{
          console.log("Successfully created new user");
          res.render("secrets");
      }
  });

})

app.listen(3000,function(req,res){
    console.log("Server is running at port 3000");
})