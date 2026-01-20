const { User } = require("../models");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// import user from excel
exports.importUsers = async (req, res) => {
    try {
        if(!req.file) {
            return res.status(400).json({
                success : false,
                message : "File Excel Required",
            });
        }

        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Format Column Excel = name | nisn
        const users = data.map((row) => ({
            username : row.username,
            nisn : row.nisn,
        }));

        await User.bulkCreate(users, { ignoreDuplicates : true});

        fs.unlinkSync(filePath); // delete file after processing

        return res.status(201).json({
            success : true,
            message : "Import User Berhasil",
            total : users.length,
        });
    } catch (error) {
        console.error("Import User false", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};

// export user to excel
exports.module = async ( req, res ) => {
    try {
        const users = await User.findAll({
            attributes : ["username", "nisn", "password", "role", "has_voted"],
        });

        const data = users.map((user) => ({
            Name : user.username,
            NISN : user.nisn,
            Password : user.password,
            role : user.role,
            hasVoted : user.has_voted ? "Yes" : "No",
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
    } catch (error) {
        
    }
}