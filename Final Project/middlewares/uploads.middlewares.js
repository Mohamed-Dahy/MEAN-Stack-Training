const multer = require("multer");
const path = require("path");


// User image storage configuration
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
cb(null, `user-${Date.now()}${ext}`);

  },
});


// Movie cover image storage configuration
const eventStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/events");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `event-${Date.now()}${ext}`);
  },
});

const discStorage = multer.diskStorage({
    destination : function(req,file,cb){
        console.log(file);
        cb(null,"uploads");
    },
    filename : function(req,file,cb){
        const extension = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${extension}`;
        cb(null,fileName);
        
    }
});

const fileFilter = (req,file,cb)=>{
    const type = file.mimetype.split("/")[0];
    if(type === "image"){
        return cb(null,true);
    }else{
        return cb(new Error("Only images are allowed"),false);
        
    }
}
const upload = multer({storage:discStorage , fileFilter : fileFilter});
const uploadUser = multer({ storage: userStorage, fileFilter });
const uploadEvent = multer({ storage: eventStorage, fileFilter });


module.exports = {upload ,uploadUser,uploadEvent} ;