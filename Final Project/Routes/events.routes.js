const eventControllers = require("../Controllers/events.conrollers");

const express = require("express");
const router = express.Router();
// Route: /events
router
  .route("/events")
  .get(eventControllers.getAllEvents);//worked // frontend done // gui 

// Route: /events/:id
router
  .route("/events/:id")
  .get(eventControllers.getEventById) //worked //frontend done // gui


  router.get("/category/:category",eventControllers.searchbycategory);//worked // frontend done // gui
module.exports = router;