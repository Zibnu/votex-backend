const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination : function (req, file, cb) {
        cb(null, "uploads/image/");
    },
    filename : function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb ) => {
    const allowedTypes = /jpg|jpeg|png/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);

    if(ext && mime) {
        cb(null, true);
    } else {
        cb(new Error("Only Image are JPG, JPEG and PNG"));
    }
};

const uploadImage = multer({
    storage,
    limits : { fileSize : 5 * 1024 * 1024 }, // max 5 mb
    fileFilter,
});

module.exports = uploadImage;