const mongoose = require("mongoose");

const connectdb = async ()=>{
    try{
        await mongoose.connect("mongodb+srv://Playstation_user:1192004@cluster0.t7vtjiv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    ,{dbname : "Games"})
     console.log("connected");
    }catch(error){
        console.log("error");
    }
}

/////////////////////////////////////////////////////////


module.exports = connectdb;