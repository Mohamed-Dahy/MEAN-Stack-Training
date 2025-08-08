const admincontroller = require("../Controllers/admins.controllers");
const express = require("express");
const upload = require("../middlewares/uploads.middlewares");
const error_multer = require("../middlewares/multererrors");

const router = express.Router();


router.post("/signupasAdmin", upload.single("photo"),error_multer,admincontroller.signup); // worked
router.get("/loginasAdmin", admincontroller.login); // worked
router.post("/adminprofile/createEvent", admincontroller.protectRoutes, admincontroller.createEvent); // worked
router.patch("/adminprofile/updateEvent/:id", admincontroller.protectRoutes, admincontroller.updateEvent); 
router.delete("/adminprofile/deleteEvent/:id", admincontroller.protectRoutes, admincontroller.deleteEvent); // worked
router.get("/adminprofile/users", admincontroller.protectRoutes, admincontroller.getAllUsers); // worked
router.get("/adminprofile/user/:id", admincontroller.protectRoutes, admincontroller.getuserbyid); // worked
router.delete("/adminprofile/user/:id", admincontroller.protectRoutes, admincontroller.deleteuserbyid); // worked

module.exports = router;