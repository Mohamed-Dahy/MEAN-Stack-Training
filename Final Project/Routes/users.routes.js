const userscontroller = require("../Controllers/users.controllers");
const express = require("express");
const upload = require("../middlewares/uploads.middlewares");
const error_multer = require("../middlewares/multererrors");

const router = express.Router();


router.post("/signup", upload.single("photo"),error_multer,userscontroller.signup); //worked


router.get("/login", userscontroller.login);//worked    
router.post("/userprofile/addtofavoriteEvents",userscontroller.protectRoutes, userscontroller.addToFavEvents);//worked
router.delete("/userprofile/favorite/removeEvent", userscontroller.protectRoutes,userscontroller.removeFromFavEvents);//worked
router.post("/userprofile/bookevent", userscontroller.protectRoutes, userscontroller.bookevent);// worked
router.delete("/userprofile/cancelbooking", userscontroller.protectRoutes, userscontroller.cancelbooking);//worked
router.post("/userprofile/createEvent", userscontroller.protectRoutes, userscontroller.createEvent);//worked
router.patch("/userprofile/updateEvent/:id", userscontroller.protectRoutes, userscontroller.updatemyEvent); //worked
router.delete("/userprofile/deleteEvent/:id", userscontroller.protectRoutes, userscontroller.deletemyEvent); //worked




module.exports = router;
