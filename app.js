const express = require("express");
const app = express();
const UserModel = require("./models/user");
const PostModel = require("./models/post");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const post = require("./models/post");


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
    console.log(req.user);
  res.render("login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
  let user = await UserModel.findOne({email: req.user.email}).populate("posts");
 
  res.render("profile",{user});
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    
    // Ensure userid is a string
    let userIdString = typeof req.user.userid === 'string' ? req.user.userid : req.user.userid.toString();
    let userId = new mongoose.Types.ObjectId(userIdString);

    // Check if user already liked the post
    let post = await PostModel.findOne({_id: req.params.id, likes: userId});

    if(post){
      // User has liked, so unlike (remove from likes)
      await PostModel.findOneAndUpdate(
        {_id: req.params.id},
        {$pull: {likes: userId}}
      );
    } else {
      // User hasn't liked, so like (add to likes)
      await PostModel.findOneAndUpdate(
        {_id: req.params.id},
        {$addToSet: {likes: userId}}
      );
    }

    res.redirect("/profile");
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).send('Error processing like');
  }
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
  let post = await PostModel.findOne({_id: req.params.id}).populate("user");
    
  res.render("edit",{post});
});

app.post("/update/:id", isLoggedIn, async (req, res) => {
  let post = await PostModel.findOneAndUpdate({_id: req.params.id}, {content:req.body.content});
    
  res.redirect("/profile");
});

app.post("/post", isLoggedIn, async (req, res) => {
  let user = await UserModel.findOne({email: req.user.email});
  let{ content } = req.body;

let post = await PostModel.create({
  user: user._id,
  content : content
});
user.posts.push(post._id);
await user.save();
res.redirect("/profile");
});


app.post("/register",async (req, res) => {
    let{ username, name, age, email, password } = req.body;

   let user = await UserModel.findOne({email});
   if(user) return res.status(500).send("User already exists");

   bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt,async(err, hash) => {
        let user = await UserModel.create({
            username,
            name,
            age,
            email,
            password : hash
        });

      let token =  jwt.sign({email:email, userid: user._id.toString()}, "secretkey");
      res.cookie("token", token);
      res.send("User registered successfully");
       


    })

})

});

app.post("/login",async (req, res) => {
    let{ email, password } = req.body;

   let user = await UserModel.findOne({email});
   if(!user) return res.status(500).send("Something went wrong");
    bcrypt.compare(password, user.password, (err, result) => {
        if(result){
        let token =  jwt.sign({email:email, userid: user._id.toString()}, "secretkey");
         res.cookie("token", token);
         res.status(200).redirect("/profile");
        }

        else res.redirect("/login");
    });


});

app.get("/logout", (req, res) => {
    res.cookie("token", "");
  res.redirect("/login");
});

function isLoggedIn(req,res, next){
    if(!req.cookies.token ) res.redirect("/login");
    else{
        let data = jwt.verify(req.cookies.token, "secretkey");
        req.user = data;
        next();
    }
    
}




app.listen(3000);