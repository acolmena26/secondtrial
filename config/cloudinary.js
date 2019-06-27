const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,

});
var storage = cloudinaryStorage({
    html: {multiple:1},
    // resource_type: "raw", 
    cloudinary: cloudinary,
    folder: 'myStory', // The name of the folder in cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg','webp','webm','mp4','mp3'],
    filename: function (req, file, cb) {
      cb(null, file.originalname); // The file on cloudinary would have the same name as the original file name
    }
  });

const uploadCloud = multer({ storage: storage });
module.exports = uploadCloud
