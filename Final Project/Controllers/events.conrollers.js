const Event = require("../Models/events.model");
const mongoose = require("mongoose");

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

const searchbycategory = async (req,res)=>{
try{
  const {category} = req.body;
  if (!category) {
    return res.status(400).json({ status: "Fail", message: "Category is required" });
  }
  const events = await Event.find({ category: category });
  if (events.length === 0) {
    return res.status(404).json({ status: "Fail", message: "No events found in this category" });
  }
  res.status(200).json({
    status: "Success",
    length: events.length,
    data: { events },
  });

}catch(error){
  res.status(500).json({ status: "Fail", message: error.message });
}
};


module.exports = {

  getAllEvents,
  getEventById,
  searchbycategory

};
