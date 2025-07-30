const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Game name is required"],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: "No description provided",
  },
  releaseDate: {
    type: Date,
    required: [true, "Release date is required"],
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    enum: ["Action", "Adventure", "RPG", "Sports", "Shooter", "Puzzle", "Other"],
  },
  platform: {
    type: String,
    required: true,
    enum: ["PS4", "PS5", "Both"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  rating: {
    type: Number,
    default: 1.0,
    min: 0,
    max: 5,
  },
});


const Game = mongoose.model("Game", GameSchema);


module.exports = Game;