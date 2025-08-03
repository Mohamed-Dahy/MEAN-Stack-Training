const eventControllers = require("../Controllers/events.conrollers");

const express = require("express");
const router = express.Router();
// Route: /events
router
  .route("/events")
  .post(eventControllers.createEvent)
  .get(eventControllers.getAllEvents);

// Route: /events/:id
router
  .route("/events/:id")
  .get(eventControllers.getEventById)
  .patch(eventControllers.updateEvent)
  .delete(eventControllers.deleteEvent);

module.exports = router;