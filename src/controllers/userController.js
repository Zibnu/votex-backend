const { User } = require("../models");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const generatePassword = require("../utils/passwordGenerator");

// import user from excel 🔥🔥
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
        const users = [];
        const exportData = [];

        for (const row of data) {
            const plainPassword = generatePassword(8);

            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            users.push({
                username : row.username,
                nisn : row.nisn,
                password : hashedPassword,
            });

            // data untuk export excel
            exportData.push({
                username : row.username,
                nisn : row.nisn,
                password : plainPassword,
            });
        }

        await User.bulkCreate(users, { ignoreDuplicates : true});

        fs.unlinkSync(filePath); // delete file after processing

        // create excell password
        const worksheetExport = XLSX.utils.json_to_sheet(exportData);
        const workbookExport = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbookExport, worksheetExport, "Users");

        const fileName = `users_votex_${Date.now()}.xlsx`;
        const exportPath = path.join(__dirname, "../../uploads/excel", fileName);

        XLSX.writeFile(workbookExport, exportPath);

        return res.download(exportPath, fileName, () => {
            fs.unlinkSync(exportPath);
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

// export user to excel ✔️✨
exports.exportsUsers = async ( req, res ) => {
    try {
        const users = await User.findAll({
            attributes : ["username", "nisn", "role", "has_voted"],
        });

        const exportData = users.map((user) => ({
            Name : user.username,
            NISN : user.nisn,
            role : user.role,
            hasVoted : user.has_voted ? "Yes" : "No",
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook,worksheet, "Users")

        const fileName = `user_votex_${Date.now()}.xlsx`;
        const filePath = path.join(__dirname, "../../uploads/excel", fileName);

        XLSX.writeFile(workbook, filePath);

        return res.download(filePath, fileName, () => {
            fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error("Export Users ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    };
};

// get all data voting status ✨✨
exports.getVotingStatus = async (req, res) => {
    try {
        const total = await User.count();
        const voted = await User.count({
            where : {
                has_voted : true,
                role : "user"
            }
        });
        const notVoted = await User.count({
            where : {
                has_voted : false,
                role : "user"
            }
        });

        return res.status(200).json({
            success : true,
            total_users : total,
            voted,
            not_voted : notVoted,
        });
    } catch (error) {
        console.error("getVotingStatus ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server ERROR",
            error : error.message,
        });
    }
};

// get data user not vote 🔥✨
exports.getUserNotVoted = async ( req, res ) => {
    try {
        const users = await User.findAll({
            where : { has_voted : false , role : "user"},
            attributes : ["id_user", "username", "nisn"],
        });

        return res.status(200).json({
            success : true,
            total : users.length,
            data : users,
        });
    } catch (error) {
        console.error("Get User Not Voted ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server ERROR",
            error : error.message,
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nisn, username} = req.body;

        const user = await User.findByPk(id);

        if(!user) {
            return res.status(404).json({
                success : false,
                message : "User Not Found",
            })
        }

        if(!nisn || !username) {
            return res.status(400).json({
                success : false,
                message : "Your Input is Null!!",
            });
        };

        await user.update({
            nisn,
            username,
        });

        const dataUser = {
            nisn,
            username,
            password : user.password,
            role : user.role,
        };

        return res.status(200).json({
            success : true,
            message : "Update User Success",
            data : dataUser,
        });
    } catch (error) {
        console.error( "Update User ERROR" , error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        })
    }
}