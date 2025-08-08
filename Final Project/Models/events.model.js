const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
 name:{
  type: String,
  required: [true, "Name is required"],
  trim: true,
  maxlength: [100, "Name cannot exceed 100 characters"],
  minlength: [3, "Name must be at least 3 characters"],
  unique: true},


  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
    minlength: [10, "Description must be at least 10 characters"]
  },

  datetime : {
    type: Date,
    required: [true, "Date is required"],
  },
    location : {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
     price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"]},

      totalseats : {
        type: Number,
        required: [true, "Total seats are required"],        
     },
     availableseats : {
        type: Number, 
        required: [true, "Available seats are required"],
        min: [0, "Available seats cannot be negative"],
        
      },
      category: {
        type: String,
        enum: ["Music", "Sports", "Arts", "Theater", "Comedy", "Other"],
        default: "Other"
      },
      imageurl : {
        type: String,
        // required: [true, "Image URL is required"]
      },
      createdby : {
        type: String,
        // required: [true, "Created by is required"],
        trim: true
      },
      createdat : {
        type: Date,
      }});

const Event = mongoose.model("Event", EventSchema);


module.exports = Event;
