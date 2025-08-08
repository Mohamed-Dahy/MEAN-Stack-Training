const multer = require("multer");

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


module.exports = upload;