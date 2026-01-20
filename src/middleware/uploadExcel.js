const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "uploads/excel/");
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"
    ]
    if(allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("File must be Excell"), false);
    }
};

module.exports = multer({storage, fileFilter});