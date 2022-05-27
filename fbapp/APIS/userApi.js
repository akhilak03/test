//create router to handle user api requests
const exp = require("express");
const userApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
//import bcryptjs for hashing password
const bcyrptjs = require("bcryptjs");
//import jsonwebtoken to create login
const jwt = require("jsonwebtoken");
//to extract body of request object
userApp.use(exp.json());
require("dotenv").config();


var cloudinary=require("cloudinary").v2;
const {CloudinaryStorage}=require("multer-storage-cloudinary");
const multer=require("multer");

//configure cloudinary
cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET,
  secure:true,
});
//configure the storage
const cloudinarystorage=new CloudinaryStorage({
  cloudinary:cloudinary,
  params:async(req,file)=>{
    return{
      folder:"fbapp",//here all images are stored and the name can be anything
      public_id:file.fieldname+"-"+Date.now(),
    }
  }
})
//configure the multer(middleware)
var upload=multer({storage:cloudinarystorage});


//Create REST API

//create route to handle '/getusers' path
userApp.get(
  "/getusers",
  expressAsyncHandler(async (request, response) => {
    //getuserCollectionobject
    let userCollectionObj = request.app.get("userObj");
    let result = await userCollectionObj.find().toArray();
    if (result == undefined) {
      response.send({ message: "no user has been created!" });
    } else {
      response.send({ message: "All users", payload: result });
    }
    //get userobj from client
  })
);

//create route to user login
userApp.post(
  "/login",
  expressAsyncHandler(async (request, response) => {
    //getuserCollectionobject
    let userCollectionObj = request.app.get("userObj");
    //get usercredentials obj from client
    let userCredObj = request.body;
    //check username
    let checkUser = await userCollectionObj.findOne({
      username: userCredObj.username
    });
    console.log(checkUser)
    if (checkUser === null) {
      response.send({ message: "Invalid Username" });
    } else {
      //compare passwords
      let status = await bcyrptjs.compare(
        userCredObj.password,
        checkUser.password
      );
      //console.log(status)
      if (status) {
        //create json web token
        let token = jwt.sign(
          { username: checkUser.username },
          process.env.SECRET_KEY,
          {
            expiresIn: 60,
          }
        );
        //send token
        response.send({
          message: "login Success!!",
          payload: token,
          userObj: checkUser,
        });
      } else {
        response.send({ message: "Invalid Password!!" });
      }
    }
  })
);

//create a route to 'create-user'
userApp.post(
  "/create-user",
  upload.single("photo"),
  expressAsyncHandler(async (request, response) => {
    //getuserCollectionobject
   // console.log(request.file.path)
    let userCollectionObj = request.app.get("userObj");
    //get userobj as string from client and convert into object
    let newUserObj = JSON.parse(request.body.userObj);
    let userOfDb = await userCollectionObj.findOne({
      username: newUserObj.username,
    });
    //search for user by username 
    if (userOfDb != null) {
      response.send({
        message: "Username has already taken,please choose another username",
      });
    } else {
      //hash pasword
      let hashedPassword = await bcyrptjs.hash(newUserObj.password, 5);
      //replace plain password with hashed password
      newUserObj.password = hashedPassword;
      //add profile image link to newuserobj
      newUserObj.profileImg=request.file.path
      //delete photo obj
      delete newUserObj.photo;
      await userCollectionObj.insertOne(newUserObj);
      response.send({ message: "new user Created!!" });
    }
  })
);

//create a route to modify user data
userApp.put(
  "/update-user",
  expressAsyncHandler(async (request, response) => {
    let userCollectionObj = request.app.get("userObj");
    //get userobj from client
    let newUserObj = request.body;
    let userOfDb = await userCollectionObj.updateOne(
      {
        username: newUserObj.username,
      },
      { $set: { ...newUserObj } }
    );
    if (userOfDb == null) {
      response.send({ message: "user not found!!" });
    } else {
      response.send({ message: "updated succesfully!!" });
    }
  })
);

//create a route to delete user by id
userApp.delete("/remove-user/:id", (request, response) => {});

module.exports = userApp;
