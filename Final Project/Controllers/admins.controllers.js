const Event = require("../Models/events.model");
const Admin = require("../Models/admins.models");
const User = require("../Models/users.model");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs"); 
const path = require("path");
const mongoose = require("mongoose");



const signup = async (req, res) => {

   try{
let { Fisrtname, Lastname,username, email, password, confirmpassword,photo } = req.body;
if (!Fisrtname || !Lastname || !email || !password || !confirmpassword || !username) {
      return res.status(400).json({ status: "Fail", message: "All fields are required" });
    }
if (password !== confirmpassword) {
  
    if(req.file){
      fs.unlinkSync(path.join(__dirname, "..","/uploads", req.file.filename));
    }
      return res.status(400).json({ status: "Fail", message: "Passwords do not match" });
    }
    const existingUser = await Admin.findOne({ email : email });
    if(existingUser){
      
    if(req.file){
      fs.unlinkSync(path.join(__dirname, "..","/uploads", req.file.filename));
    }
        return res.status(400).json({ status: "Fail", message: "User already exists" });
    }

   photo = req.file.filename;
    const newUser = await Admin.create({
    Fisrtname,
    Lastname,
    username,
    email,
    password,
    photo
});

    const token = JWT.sign({ id: newUser._id , username : newUser.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    res.status(201).json({
      status: "Success",
      data: { user: newUser },
      token : token,

    });
   }catch(error){
    // Handle file upload errors law el user mawgood myrf3sh el sora

    if(req.file){
      fs.unlinkSync(path.join(__dirname, "..","/uploads", req.file.filename));
    }
        res.status(400).json({ status: "Fail", message: error.message });
   }

};


const login = async (req, res) => {
  try{
const {email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "Email or Password is missing" });
  }

  const existingUser = await Admin.findOne({ email: email });
  if (!existingUser) {
    return res.status(404).json({
      status: "fail",
      message: "User not exists",
    });
  }

  const matchedPassword = await bcrypt.compare(password, existingUser.password);
  if (!matchedPassword) {
    return res.status(404).json({
      status: "fail",
      message: "User not exists",
    });
  }
  existingUser.password = undefined;
   const token = JWT.sign(
     { id: existingUser._id, email ,name: existingUser.name , expiresIn: process.env.JWT_EXPIRATION },
     process.env.JWT_SECRET,
     { expiresIn: process.env.JWT_EXPIRATION }
   );
  return res.status(200).json({
    status: "success",
    token: token,
    data: { user: existingUser },
  });
  }catch(error){
    res.status(401).json({ status: "fail", message: error.message });
  }
  
};



const protectRoutes = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
    }
    if (!token) {
    return  res
        .status(400)
        .json({ status: "fail", message: "Your are not logged in" });
    }
   const decodedToken = JWT.verify(token, process.env.JWT_SECRET);
   req.userId = decodedToken.id
    next();
  } catch (error) {
    res.status(401).json({ status: "fail", message: error.message });
  }
};



const getAllUsers = async (req, res) => {
    try{
      const admin = await Admin.findById(req.userId);
      if (!admin) {
        return res.status(404).json({ status: "Fail", message: "Admin not found" });
      }
        const users = await User.find({},{password:  false ,_v: false});
        res.status(200).json({
            status: "Success", length: users.length, data: { users }
        });
    }catch(error){
        res.status(404).json({ status: "Fail", message: error.message });
    }
};
const deleteuserbyid = async (req,res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)){
    return res.status(400).json({ status: "Fail", message: "Invalid ID" });
  }
  
  try{
    const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(404).json({ status: "Fail", message: "Admin not found" });
    } 

    const user = await User.findByIdAndDelete(req.params.id);

    if(!user){
   return res.status(404).json({ status: "Fail", message: "User is not found" });
    }
    res.status(200).json({
      status: "Success - Deleted",
      data: { user },
    });

  }catch(error){
     res.status(500).json({ status: "Fail", message: error.message });
  }
}
const getuserbyid = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: "Fail", message: "Invalid ID" });
  }
  try {
    const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(404).json({ status: "Fail", message: "Admin not found" });
    }
    const user = await User.findById(req.params.id, { password: false, _v: false });
    if (!user) {
      return res.status(404).json({ status: "Fail", message: "User is not found" });
    }
    res.status(200).json({
      status: "Success",
      data: { user },
    });
  } catch (error) { 
    res.status(500).json({ status: "Fail", message: error.message });
  }
}

const createEvent = async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(404).json({ status: "Fail", message: "Admin not found" });
    }
    const newEvent = await Event.create(req.body);
    newEvent.createdby = req.userId; // Assuming you want to set the creator of the event
    await newEvent.save();
    res.status(201).json({
      status: "Success",
      data: { event: newEvent },
    });
  } catch (error) {
    res.status(400).json({ status: "Fail", message: error.message });
  }

};

const updateEvent = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: "Fail", message: "Invalid ID" });
  }

  try {
    const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(404).json({ status: "Fail", message: "Admin not found" });
    }
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Success",
      data: { event: updatedEvent },
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: "Fail", message: "Invalid ID" });
  }

  try {
     const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(404).json({ status: "Fail", message: "Admin not found" });
    }
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "Success - Deleted",
      data: { event: deletedEvent },
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};
// see every user who booked an event
const getBookedUsers = async (req, res) => {
  
  try {
     const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(404).json({ status: "Fail", message: "Admin not found" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ status: "Fail", message: "Event not found" });
    }
    res.status(200).json({
      status: "Success",
      data: { bookedUsers: event.bookedusers },
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
 
}

module.exports = {
  signup,
  login,
  protectRoutes,
  getAllUsers,
  createEvent,
  updateEvent,
  deleteEvent,
  getuserbyid,
  deleteuserbyid,
  getBookedUsers
};
