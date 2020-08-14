require('dotenv').config()
const express=require("express")
const ejs=require("ejs")
const bodyp=require("body-parser")
const mongoose=require("mongoose")
const encrypt=require("mongoose-encryption")

const app=express()
mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

app.set('view engine', 'ejs');
app.use(bodyp.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]})

const WebUser = mongoose.model("WebUser",userSchema);

app.listen(3000,function(){
  console.log("listening on port 3000...")
})

app.get("/",function(req,res){
  res.render("home");
})

app.get("/login",function(req,res){
  res.render("login");
})

app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register",function(req,res){
  const uname=req.body.username;
  const pword=req.body.password;
  const newUser=new WebUser({
    email:uname,
    password:pword
  })
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }
  })
});

app.post("/login",function(req,res){
  const uname=req.body.username;
  const pword=req.body.password;

  WebUser.findOne({email:uname},function(err,foundUser){
    if(!err){
      if(foundUser){
        if(foundUser.password===pword){
          res.render("secrets");
        }
      }
    }
  })

})
