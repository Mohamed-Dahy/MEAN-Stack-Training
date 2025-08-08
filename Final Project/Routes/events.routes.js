const eventControllers = require("../Controllers/events.conrollers");

const express = require("express");
const router = express.Router();
// Route: /events
router
  .route("/events")
  .get(eventControllers.getAllEvents);//worked

// Route: /events/:id
router
  .route("/events/:id")
  .get(eventControllers.getEventById) //worked


  router.get("/category",eventControllers.searchbycategory);//worked
module.exports = router;
