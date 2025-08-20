const userscontroller = require("../Controllers/users.controllers");
const express = require("express");
const {upload,uploadUser,uploadEvent} = require("../middlewares/uploads.middlewares");
const error_multer = require("../middlewares/multererrors");

const router = express.Router();


router.post("/signup", uploadUser.single("photo"),error_multer,userscontroller.signup); //worked // fronted done // gui


router.post("/login", userscontroller.login);//worked    // Frontend done // gui
router.post("/userprofile/addtofavoriteEvents/:eventId",userscontroller.protectRoutes, userscontroller.addToFavEvents);//worked // Frontend done // gui
router.get("/userprofile/favourites",userscontroller.protectRoutes, userscontroller.getfavourites); // worked // fronted done / gui
router.get("/userprofile/tickets",userscontroller.protectRoutes, userscontroller.viewbookedtickets); // worked 
router.get("/userprofile/myevents",userscontroller.protectRoutes, userscontroller.viewMyevents);
router.get("/userprofile/updateinfo",userscontroller.protectRoutes, userscontroller.updateUser);
router.delete("/userprofile/favorite/:eventid", userscontroller.protectRoutes,userscontroller.removeFromFavEvents);//worked // Frontend done // gui
router.post("/userprofile/bookevent/:Eventid", userscontroller.protectRoutes, userscontroller.bookevent);// worked // Frontend done // gui
router.delete("/userprofile/cancelbooking/:ticketid", userscontroller.protectRoutes, userscontroller.cancelbooking);//worked // Frontend done
router.post("/userprofile/createEvent", uploadEvent.single("coverImage"),error_multer,userscontroller.protectRoutes, userscontroller.createEvent);//worked // frontend done // gui
router.patch("/userprofile/updateEvent/:id", userscontroller.protectRoutes, userscontroller.updatemyEvent); //worked // frontend done
router.delete("/userprofile/deleteEvent/:id", userscontroller.protectRoutes, userscontroller.deletemyEvent); //worked // frontend done




module.exports = router;