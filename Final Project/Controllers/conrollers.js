const Game = require("../Models/games.model");
const mongoose = require("mongoose");

const createGame = async (req, res) => {
  try {
    const newGame = await Game.create(req.body);
    res.status(201).json({
      status: "Success",
      data: { game: newGame },
    });
  } catch (error) {
    res.status(400).json({ status: "Fail", message: error.message });
  }
};

const getAllGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({
      status: "Success",
      length: games.length,
      data: { games },
    });
  } catch (error) {
    res.status(404).json({ status: "Fail", message: error.message });
  }
};

const getGameById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: "Fail", message: "Invalid ID" });
  }

  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      return res.status(404).json({ status: "Fail", message: "Game not found" });
    }

    res.status(200).json({
      status: "Success",
      data: { game },
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

const updateGame = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: "Fail", message: "Invalid ID" });
  }

  try {
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Success",
      data: { game: updatedGame },
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

const deleteGame = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: "Fail", message: "Invalid ID" });
  }

  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "Success - Deleted",
      data: { game: deletedGame },
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

module.exports = {
  createGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame,
};
