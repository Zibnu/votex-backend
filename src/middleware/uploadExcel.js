const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "../../uploads/excel");
    },
    filename : (req, file, cd) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype.includes("spreadsheet")) {
        cb(null, true);
    } else {
        cb(new Error("File must be Excell"), false);
    }
};

module.exports = multer({storage, fileFilter});