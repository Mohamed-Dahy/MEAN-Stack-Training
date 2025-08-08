const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    EventName : {
        type : String,
        required: [true, "Name is required"],
        trim: true,
    },
    Userid : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
    Eventid : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: [true, "Event ID is required"],
    },
    Date:{
        type: Date,
        required: [true, "Date is required"],
    },
    EventPrice : {
        type : Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    Place : {
        type : String,
        required: [true, "Place is required"],
        trim: true,
    },
    photo : {type: String}, 
    qrcode: { type: String, default: '' }, // QR code for the ticket
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
