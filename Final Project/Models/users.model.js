const mongoose = require("mongoose");
const validator = require("validator");



const userSchema = new mongoose.Schema({
  Fisrtname:{
    type: String,
    required: [true, "First name is required"],
    trim: true,
    maxlength: [50, "First name cannot exceed 50 characters"],
    minlength: [2, "First name must be at least 2 characters"]},

    Lastname:{
    type: String,
    required: [true, "Last name is required"],
    trim: true,
    maxlength: [50, "Last name cannot exceed 50 characters"],
    minlength: [2, "Last name must be at least 2 characters"]},

    email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    validate: [validator.isEmail, "Please Enter a Valid Email"]
    },
    password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
    },

    username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    maxlength: [30, "Username cannot exceed 30 characters"],
    minlength: [3, "Username must be at least 3 characters"]
    },
    photo: { type: String },
    favEvents :[{type: mongoose.Schema.Types.ObjectId, ref: "Event"}],

  }
);

const User = mongoose.model("User", userSchema);


module.exports = User;