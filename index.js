import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

// Using Middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting up View Engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "sdjasdbajsdbjasd");

    req.user = await User.findById(decoded._id);

    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  res.render("logout", { name: req.user.name });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.redirect("/register");

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.render("login", { email, message: "Incorrect Password" });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("Server is working");
});






// import express from 'express';
// // import fs from "fs";
// import path from 'path';
// import mongoose from 'mongoose';
// import cookieParser from 'cookie-parser';
// import jwt from 'jsonwebtoken';
// import bcrypt from "bcrypt";

    
    
// mongoose.connect("mongodb://localhost:27017",{
//     dbName:"backend",
// }).then(()=>console.log("Database Connected")).catch((e) => console.log(e));

// const userSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     password: String,
// });

// const User = mongoose.model("User",userSchema)

// const app = express();
// //const users = [];

// //express.static =(path.join(path.resolve(),"public"));

// //using middleware
// app.use(express.static(path.join(path.resolve(),"public")));
// app.use(express.urlencoded({ extended:true}));
// app.use(cookieParser());

// //setting up view engine
// app.set("view engine", "ejs");

// const isAuthenticated = async (req,res,next)=>{
//     const {token} = req.cookies;
//     if(token){
//         const decoded = jwt.verify(token,"dsfsdfsfsfsfsdf");
        
//         req.user = await User.findById(decoded._id)

//         // res.render("logout");
//         next();
//     }else{
//         res.redirect("/login");
//     }
// }

// app.get("/",isAuthenticated,(req,res)=>{
//     // console.log(req.user);
//     res.render("logout",{name:req.user.name});

//     // res.send("Hi")
//     // res.statusCode(404);
//     // res.json({
//     //     success: true,
//     //     products:[]
//     // });
//     // res.status(400).json("meri marzi")
//     // const file = fs.readFileSync("./index.html");
//     // const pathlocation = path.resolve();


//     // const {token} = req.cookies;
//     // if(token){
//     //     res.render("logout");

//     // }else{

//     //     res.render("login");
//     // }
//     // res.sendFile("index")
//     // res.sendFile(path.join(pathlocation,"./index.html"));

//     // res.sendFile("./index.html");
// });

// app.get("/login", (req,res)=>{
//     res.render("login");
// })

// app.get("/register",(req,res)=>{
    
//     res.render("register");

// });

// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;
  
//     let user = await User.findOne({ email });
//     if (!user) return res.redirect("/register");
//     const isMatch = await bcrypt.compare(password, user.password);
    
//     if (!isMatch)
//       return res.render("login", { email, message: "Incorrect Password" });
  
//     const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");
  
//     res.cookie("token", token, {
//       httpOnly: true,
//       expires: new Date(Date.now() + 60 * 1000),
//     });
//     res.redirect("/");
//   });

// app.post("/register", async (req,res)=>{
//     const {name, email, password} = req.body;

//     let user = await User.findOne({email});
//     if(user){
//         return res.redirect("/login");
//     }

//     const hashedPassword = await bcrypt.hash(password,10);

//     user = await User.create({
//         name,
//         email,
//         password: hashedPassword,
//     });

//     const token = jwt.sign({_id:user._id},"dsfsdfsfsfsfsdf");
//      //console.log(token);

//     res.cookie("token",token,{
//         httpOnly: true,
//         expires:new Date(Date.now()+60*1000),
//     });
//     res.redirect("/")
// })

// app.get("/logout",(req,res)=>{
//     res.cookie("token",null,{
//         httpOnly: true,
//         expires:new Date(Date.now()),
//     });
//     res.redirect("/")
// })
// // app.get("/add", async (req,res)=>{
// //     await Messge.create({name:"Vishal2",email:"sample2@gmail.com"})

// //         res.send("Nice");
// // });


// // app.get("/success",(req,res)=>{
    
// //     res.render("success");
// // });

// // app.get("/users",(req,res)=>{
// //     res.json({
// //         users,
// //     });
// // });

// // app.post("/contact", async (req,res)=>{
// //     //2nd tarika
// //     const { name,email} = req.body;
// //     await Messge.create({name,email});//agar variable name same hai front end or backend ka
// //     res.redirect("/success");

// //     //1 tarika
// //     // await Messge.create({name:req.body.name, email:req.body.email});
// //     // res.redirect("/success");
// // })

// app.listen(5000,()=>{
//     console.log("Server is working");
// });







// // import http from "http";
// // import { generateLovePercent } from "./features.js";
// // import fs from "fs";
// // // import path from 'path';

// // // console.log(path.extname("/home/random/index.js"))

// // const home  = fs.readFileSync("./index.html");

// // //import gfName from "./features.js";
// // // import { gfName2,gfName3 } from "./features.js";
// // // import * as myObj from "./features.js"; // sabhi export ko ek sath import karna ho
// // // console.log(myObj);
// // const server = http.createServer((req,res)=>{
// //     console.log(req.method);

// //     if(req.url==="/about"){
// //         res.end(`<h1>Love is ${generateLovePercent()}</h1>`)
// //     }
// //     else if(req.url==="/"){
        
// //             res.end("home")
        
        
// //     }
// //     else if(req.url==="/contact"){
// //         res.end("<h1>Contact Page</h1>")
// //     }
// //     else{
// //         res.end("<h1>Page Not Found</h1>")
// //     }
// // });

// // server.listen(5000,()=>{
// //     console.log("Server is working");
// // })