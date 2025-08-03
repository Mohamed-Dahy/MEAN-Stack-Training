const Event = require("../Models/events.model");
const mongoose = require("mongoose");

const createEvent = async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json({
      status: "Success",
      data: { game: newEvent },
    });
  } catch (error) {
    res.status(400).json({ status: "Fail", message: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({
      status: "Success",
      length: events.length,
      data: { events },
    });
  } catch (error) {
    res.status(404).json({ status: "Fail", message: error.message });
  }
};

const getEventById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: "Fail", message: "Invalid ID" });
  }

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ status: "Fail", message: "Event is not found" });
    }

    res.status(200).json({
      status: "Success",
      data: { event },
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

const updateEvent = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: "Fail", message: "Invalid ID" });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Success",
      data: { event: updatedEvent },
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ status: "Fail", message: "Invalid ID" });
  }

  try {
    const deletedEvent = await Game.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "Success - Deleted",
      data: { event: deletedEvent },
    });
  } catch (error) {
    res.status(500).json({ status: "Fail", message: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
