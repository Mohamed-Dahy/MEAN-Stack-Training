const Event = require("../Models/events.model");
const User = require("../Models/users.model");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {

    try{
        const users = await User.find({},{password:  false ,_v: false});
        res.status(200).json({
            status: "Success", length: users.length, data: { users }
        });
    }catch(error){
        res.status(404).json({ status: "Fail", message: error.message });
    }
};


const signup = async (req, res) => {

   try{
let { Fisrtname, Lastname,username, email, password, confirmpassword,photo } = req.body;
if (!Fisrtname || !Lastname || !email || !password || !confirmpassword || !username) {
      return res.status(400).json({ status: "Fail", message: "All fields are required" });
    }
if (password !== confirmpassword) {
      return res.status(400).json({ status: "Fail", message: "Passwords do not match" });
    }
    const existingUser = await User.findOne({ email : email });
    if(existingUser){
        return res.status(400).json({ status: "Fail", message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
    Fisrtname,
    Lastname,
    username,
    email,
    password: hashedPassword,
    photo
});

    const token = JWT.sign({ id: newUser._id , username : newUser.username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
    res.status(201).json({
      status: "Success",
      data: { user: newUser },
      token : token,

    });
   }catch(error){
        res.status(400).json({ status: "Fail", message: error.message });
   }

};


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "fail", message: "Email or Password is missing" });
  }

  const existingUser = await User.findOne({ email: email });
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
  const token = JWT.sign(
    { id: existingUser._id, name: existingUser.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION }
  );
  return res.status(200).json({
    status: "success",
    token: token,
    data: { user: { name: existingUser.name, email } },
  });
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
const addToFavEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const { eventid } = req.body;

    if (!eventid) {
      return res.status(400).json({ status: "fail", message: "Event ID is required" });
    }
    // Check if the event exists
    const event = await Event.findById(eventid);
    if (!event) {
        return res.status(404).json({ status: "fail", message: "Event not found" });
    }


    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    if (!user.favEvents.includes(eventid)) {
      user.favEvents.push(eventid);
      await user.save();
    }

    res.status(200).json({ status: "success", data: { favEvents: user.favEvents } });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
const removeFromFavEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const { eventid } = req.body;

    if (!eventid) {
      return res.status(400).json({ status: "fail", message: "Event ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    user.favEvents = user.favEvents.filter(id => id.toString() !== eventid);
    await user.save();

    res.status(200).json({ status: "success", data: { favEvents: user.favEvents } });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};


module.exports = {
  getAllUsers,
    signup,
    login,
    protectRoutes,
    addToFavEvents,
    removeFromFavEvents
};
