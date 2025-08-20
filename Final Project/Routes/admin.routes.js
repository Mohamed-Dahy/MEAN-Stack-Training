const admincontroller = require("../Controllers/admins.controllers");
const express = require("express");
const {upload,uploadEvent,uploadUser} = require("../middlewares/uploads.middlewares");
const error_multer = require("../middlewares/multererrors");

const router = express.Router();


router.post("/signupasAdmin", upload.single("photo"),error_multer,admincontroller.signup); // worked
router.post("/loginasAdmin", admincontroller.login); // worked // fronted done
router.post("/adminprofile/createEvent", admincontroller.protectRoutes, admincontroller.createEvent); // worked // frontend done
router.patch("/adminprofile/updateEvent/:id", admincontroller.protectRoutes, admincontroller.updateEvent); // worked // frontend done
router.delete("/adminprofile/deleteEvent/:id", admincontroller.protectRoutes, admincontroller.deleteEvent); // worked // frontend done
router.get("/adminprofile/users", admincontroller.protectRoutes, admincontroller.getAllUsers); // worked // frontend done
router.get("/adminprofile/user/:id", admincontroller.protectRoutes, admincontroller.getuserbyid); // worked // frontend done
router.delete("/adminprofile/user/:id", admincontroller.protectRoutes, admincontroller.deleteuserbyid); // worked   // frontend done
router.get("/adminprofile/bookedUsers/:id", admincontroller.protectRoutes, admincontroller.getBookedUsers); // worked

module.exports = router;