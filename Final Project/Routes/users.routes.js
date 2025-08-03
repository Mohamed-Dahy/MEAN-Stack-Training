const userscontroller = require("../Controllers/users.controllers");
const express = require("express");
const router = express.Router();
router.get("/users", userscontroller.getAllUsers);
router.post("/signup", userscontroller.signup);
router.post("/login", userscontroller.login);
router.post("/favoriteEvents",userscontroller.protectRoutes, userscontroller.addToFavEvents);
router.delete("/favorite/removeEvent", userscontroller.protectRoutes,userscontroller.removeFromFavEvents);



module.exports = router;