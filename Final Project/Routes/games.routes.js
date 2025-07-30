const gameControllers = require("../Controllers/conrollers");

const express = require("express");
const router = express.Router();
// Route: /games
router
  .route("/")
  .post(gameControllers.createGame)
  .get(gameControllers.getAllGames);

// Route: /games/:id
router
  .route("/:id")
  .get(gameControllers.getGameById)
  .patch(gameControllers.updateGame)
  .delete(gameControllers.deleteGame);

module.exports = router;