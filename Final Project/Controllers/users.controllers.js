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
    try {
        let { Firstname, Lastname, username, email, password, confirmpassword } = req.body;

        if (!Firstname || !Lastname || !email || !password || !confirmpassword || !username) {
            return res.status(400).json({ status: "Fail", message: "All fields are required" });
        }

        if (password !== confirmpassword) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, "..", "/uploads", req.file.filename));
            }
            return res.status(400).json({ status: "Fail", message: "Passwords do not match" });
        }

        const existingUser  = await User.findOne({ email: email });
        if (existingUser ) {
            if (req.file) {
                fs.unlinkSync(path.join(__dirname, "..", "/uploads", req.file.filename));
            }
            return res.status(400).json({ status: "Fail", message: "User  already exists" });
        }

        const photo = req.file ? req.file.filename : null; // Ensure photo is set correctly

        const newUser  = await User.create({
            Firstname,
            Lastname,
            username,
            email,
            password,
            photo
        });

        const token = JWT.sign({ id: newUser ._id, username: newUser .username }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        res.status(201).json({
            status: "Success",
            data: { user: newUser  },
            token: token,
        });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, "..", "/uploads", req.file.filename));
        }
        res.status(400).json({ status: "Fail", message: error.message || "An error occurred" });
    }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // user id from route
    const { Firstname, Lastname, username, email, password } = req.body;

    // Find the user
    const user = await User.findById(id);
    if (!user) {
      if (req.file) {
        fs.unlinkSync(path.join(__dirname, "..", "/uploads", req.file.filename));
      }
      return res.status(404).json({ status: "Fail", message: "User not found" });
    }

    // Handle new photo upload (delete old one if exists)
    if (req.file) {
      if (user.photo) {
        const oldPath = path.join(__dirname, "..", "/uploads", user.photo);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      user.photo = req.file.filename;
    }

    // Update basic fields
    if (Firstname) user.Firstname = Firstname;
    if (Lastname) user.Lastname = Lastname;
    if (username) user.username = username;
    if (email) user.email = email;

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save user
    const updatedUser = await user.save();

    res.status(200).json({
      status: "Success",
      message: "User updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, "..", "/uploads", req.file.filename));
    }
    res.status(400).json({ status: "Fail", message: error.message || "An error occurred" });
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
  existingUser.password = undefined; // Remove password from the response
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
const getfavourites = async (req, res) => {
  try {
    const userId = req.userId; // must be set by auth middleware

    const user = await User.findById(userId).populate("favEvents");
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: user.favEvents, // returns populated events
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const addToFavEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ status: "fail", message: "Event ID is required" });
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event not found" });
    }

    // Update user favorites without full validation
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favEvents: eventId } }, // prevents duplicates
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.status(200).json({ 
      status: "success", 
      data: { favEvents: updatedUser.favEvents } 
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const removeFromFavEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const { eventid } = req.params;

    if (!eventid) {
      return res.status(400).json({ status: "fail", message: "Event ID is required" });
    }

    // Check if the event exists
    const event = await Event.findById(eventid);
    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event not found" });
    }

    // Remove event from user's favorites
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favEvents: eventid } }, // removes if it exists
      { new: true } // return updated doc
    );

    if (!updatedUser) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: { favEvents: updatedUser.favEvents }
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};



// backend
const bookevent = async (req,res)=>{ 
try { 

 const userId = req.userId;
  const { Eventid } = req.params  ;
  if (!Eventid) {
    return res.status(400).json({ status: "fail", message: "Event ID is required" });
  }
 
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

    await User.findByIdAndUpdate(
  userId,
  {
    $push: { myqrcodes: qrCode, bookedtickets: ticket._id }
  },
  { new: true, runValidators: false }
);
    res.status(201).json({ status: "success", data: { ticket } });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
}
const viewbookedtickets = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware

    // find the user and populate their booked tickets
    const user = await User.findById(userId).populate("bookedtickets"); 
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: user.bookedtickets, // full ticket documents with event info + QR code
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};



const cancelbooking = async (req, res) => {
  try {
    const userId = req.userId;
    const { ticketid } = req.params;

    if (!ticketid) {
      return res.status(400).json({ status: "fail", message: "Ticket ID is required" });
    }

    const ticket = await Ticket.findById(ticketid);
    if (!ticket) {
      return res.status(404).json({ status: "fail", message: "Ticket not found" });
    }

    const eventid = ticket.Eventid;
    const event = await Event.findById(eventid);
    if (!event) {
      return res.status(404).json({ status: "fail", message: "Event not found" });
    }

    const usercancel = await User.findById(userId);
    const hasTicket = usercancel.bookedtickets.some(id => id.toString() === ticketid);
    if (!hasTicket) {
      return res.status(404).json({ status: "fail", message: "You have not booked this ticket" });
    }

    // Remove ticket from user's bookedtickets using $pull
    await User.findByIdAndUpdate(
      userId,
      { $pull: { bookedtickets: ticketid } },
      { new: true }
    );

    // Update event available seats and bookedusers
    event.availableseats += 1;
    event.bookedusers = event.bookedusers.filter(id => id.toString() !== userId);
    await event.save();

    // Delete the ticket
    await Ticket.findByIdAndDelete(ticketid);

    res.status(200).json({ status: "success", message: "Booking cancelled successfully", data: { ticket } });

  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};


const createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
     if (req.file) {
      newEvent.imageurl = req.file.filename;
    }
    newEvent.createdby = req.userId; // Assuming you want to set the creator of the event
    await newEvent.save();
    res.status(201).json({
      status: "Success",
      data: { event: newEvent },
    });
  } catch (error) {
     if (req.file) {
      try {
        fs.unlinkSync(
          path.join(__dirname, "..", "uploads/events", req.file.filename)
        );
      } catch (unlinkErr) {
        console.error("Failed to delete uploaded file:", unlinkErr.message);
      }
    }
    res.status(400).json({ status: "Fail", message: error.message });
  }
};

const viewMyevents = async (req, res) => {
  try {
    // Find all events where createdby matches the logged-in user's ID
    const myEvents = await Event.find({ createdby: req.userId });

    if (myEvents.length === 0) {
      return res.status(404).json({
        status: "Fail",
        message: "You have not created any events yet",
      });
    }

    res.status(200).json({
      status: "Success",
      results: myEvents.length,
      data: { events: myEvents },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
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
    getfavourites,
    viewbookedtickets,
    viewMyevents,
    updateUser
};
