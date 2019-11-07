const  multer =  require('multer');

/*var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./Images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});*/
/*export const upload = multer({
    dest:'images/', 
    limits: {fileSize: 10000000, files: 1},
    fileFilter:  (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {

            return callback(new Error('Only Images are allowed !'), false)
        }

        callback(null, true);
    }
}).single('image')
/*export const  upload = multer({
    storage: Storage
}).array("imgUploader", 3); //Field name and max count
*/
export const upload = multer({
    limits:{
        fileSize : 4*4024*4024
    }
})
