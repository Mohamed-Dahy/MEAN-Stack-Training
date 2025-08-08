const Event = require("../Models/events.model");
const User = require("../Models/users.model");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const fs = require("fs"); 
const path = require("path");
const Ticket = require("../Models/tickets.model");
const QR = require("qrcode");


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
    const existingUser = await User.findOne({ email : email });
    if(existingUser){
      
    if(req.file){
      fs.unlinkSync(path.join(__dirname, "..","/uploads", req.file.filename));
    }
        return res.status(400).json({ status: "Fail", message: "User already exists" });
    }

   photo = req.file.filename;
    const newUser = await User.create({
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
    data: { user: existingUser },
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

const bookevent = async (req,res)=>{
 const userId = req.userId;
  const {Eventid} = req.body;
  if (!Eventid) {
    return res.status(400).json({ status: "fail", message: "Event ID is required" });
  }
  try {
    const event = await Event.findById(Eventid);
    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event not found" });
    }
    if (event.availableseats <= 0) {
      return res.status(400).json({ status: "fail", message: "No available seats" });
    }
    const ticket = await Ticket.create({
      EventName: event.name,
      Userid: userId,
      Eventid: Eventid,
      Date: event.datetime,
      EventPrice: event.price,
      Place: event.location,
      photo: event.imageurl
    });
    event.availableseats -= 1;
    event.bookedusers.push(userId);
    await event.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }
    // Generate QR code for the ticket
    const qrCode = await QR.toDataURL(ticket._id.toString());
    ticket.qrcode = qrCode;
    await ticket.save();
    user.myqrcodes.push(qrCode);
    user.bookedtickets.push(ticket._id);
    await user.save();
    res.status(201).json({ status: "success", data: { ticket } });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}

//generate qr code for ticket  
//const generateQRCode = async (req, res) 














const cancelbooking = async (req,res)=>{
    try{
      const userId = req.userId;
      const { ticketid , eventid} = req.body;
      if(!ticketid){
       return res.status(400).json({status: "fail", message: "Ticket ID is required"});
      }
      if(!eventid){
       return res.status(400).json({status: "fail", message: "Event ID is required"});
      }
      const ticket = await Ticket.findById(ticketid);
      if(!ticket){
        return res.status(404).json({ status: "fail", message: "Ticket not found" });
      }
     const event = await Event.findById(eventid);

      if(ticket.Eventid.toString() !== eventid){
        return res.status(400).json({ status: "fail", message: "Ticket does not belong to this event" });
      }
      const usercancel = await User.findById(userId);
      const hasTicket = usercancel.bookedtickets.some(id => id.toString() === ticketid);
      if(!hasTicket){
        return res.status(404).json({ status: "fail", message: "You have not booked this ticket" });
      }else{
        usercancel.bookedtickets = usercancel.bookedtickets.filter(id => id.toString() !== ticketid);
        await usercancel.save();

        if(!event){
          return res.status(404).json({ status: "fail", message: "Event not found" });
        }
        event.availableseats += 1;
        event.bookedusers = event.bookedusers.filter(id => id.toString() !== userId);
        await event.save();
        await Ticket.findByIdAndDelete(ticketid);
        res.status(200).json({ status: "success", message: "Booking cancelled successfully" });
      }
        } catch(error){
        res.status(500).json({ status: "fail", message: error.message });
    }

}

const createEvent = async (req, res) => {
  try {
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

const updatemyEvent = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: "Fail", message: "Invalid ID" });}
try{
  const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ status: "Fail", message: "Event not found" });
      }
      if (event.createdby.toString() !== req.userId) {
        return res.status(403).json({ status: "Fail", message: "You are not authorized to update this event" });
      }
  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "Success",
    data: { event: updatedEvent },
  });
}catch(error){
    res.status(500).json({ status: "Fail", message: error.message });
  }
    




};

const deletemyEvent = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: "Fail", message: "Invalid ID" });
  }
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ status: "Fail", message: "Event not found" });
    }
    if (event.createdby.toString() !== req.userId) {
      return res.status(403).json({ status: "Fail", message: "You are not authorized to delete this event" });
    }
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "Success - Deleted",
      data: { event: deletedEvent },
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
}};

module.exports = {
  createEvent,
    signup,
    login,
    protectRoutes,
    addToFavEvents,
    removeFromFavEvents,
    bookevent,
    cancelbooking,
    updatemyEvent,
    deletemyEvent,
};
