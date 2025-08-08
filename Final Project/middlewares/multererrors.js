 const multer = require("multer");
 
 
 const error_multer = (error,req,res,next)=>{
        if(
          error instanceof multer.MulterError || 
          error.message === "Only images are allowed"
        ){
            return res.status(400).json({
                status: "Fail",
                message: error.message
            });
        }
        next();
    }

module.exports = error_multer;    