const { User, Setting, sequelize, Vote } = require("../models");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const generatePassword = require("../utils/passwordGenerator");
const { Op, where } = require("sequelize");

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

        if(!data || data.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({
                success : false,
                message : "No data in your file!!!"
            })
        }

        const nisnList = data.map(row => row.nisn);
        const existingUsers = await User.findAll({
            where : {
                nisn : nisnList,
            },
            attributes : ["nisn"],
        });
        const existingNisn = existingUsers.map(user => user.nisn)
        const duplicateNisn = data.filter(row => existingNisn.includes(row.nisn));
        if(duplicateNisn.length > 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({
                success : false,
                message : "User Already Exists!!"
            })
        }

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

        await User.bulkCreate(users);

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

exports.getAllUser = async (req, res) => {
    try {
        const { page = 1, limit = 7,search } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit)

        let where = {};

        if(search) {
            where = {
                [Op.or] : [
                    {
                        username : {
                            [Op.iLike] : `%${search}%`,
                        },
                    },
                    {
                        nisn : {
                            [Op.like] : `%${search}%`
                        }
                    }
                ]
            };
        }

        const { count, rows : users} = await User.findAndCountAll({
            where,
            limit : parseInt(limit),
            offset,
            attributes : ["id_user", "username", "nisn", "role", "has_voted"],
            order : [["id_user", "ASC"]],
        });

        return res.status(200).json({
            success : true,
            message : "Get All User Success",
            data : {
                users,
                pagination : {
                    currentPage : parseInt(page),
                    totalPages : Math.ceil( count / parseInt(limit)),
                    totalItems : count,
                    itemsPerPage : parseInt(limit),
                },
            },
        });
    } catch (error) {
        console.error("Get All User Error" ,error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};

exports.deleteUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;

        const setting = await Setting.findOne({
            transaction,
            lock : transaction.LOCK.UPDATE,
        });

        if(setting.is_setting_open) {
            await transaction.rollback();
            return res.status(403).json({
                success : false,
                message : "Sistem Voting is Open, Please Close Voting For Delete User!!",
            });
        }

        const vote = await Vote.findOne({
            where : { user_id : id},
            transaction,
        });

        if(vote) {
            await transaction.rollback();
            return res.status(400).json({
                success : false,
                message : "If the user has vote data, please reset the voting first",
            });
        }

        const user = await User.findByPk(id, 
            {transaction},
        );

        if(!user) {
            await transaction.rollback()
            return res.status(404).json({
                success : false,
                message : "User Not Found",
            });
        };

        await user.destroy({
            force : true,
            transaction,
        });

        await transaction.commit();

        return res.status(200).json({
            success : true,
            message : "Delete User Success",
        });
    } catch (error) {
        if(!transaction.finished) {
            await transaction.rollback();
        }

        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};

exports.deleteAllUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {

        const setting = await Setting.findOne({
            transaction,
            lock : transaction.LOCK.UPDATE,
        });

        if(setting.is_setting_open) {
            await transaction.rollback();
            return res.status(403).json({
                success : false,
                message : "System Voting Is Open, Please Close For Delete All User!!",
            });
        }

        const voteCount = await Vote.count({ transaction });

        if(voteCount > 0) {
            await transaction.rollback();
            return res.status(400).json({
                success : false,
                message : "There is still voting data, please reset the voting first!!",
            });
        }

        const deletedCount = await User.destroy({
            where : {
                role : "user", // for delete acount user not admin account
            },
            force : true,
            transaction,
        });

        await transaction.commit();

        return res.status(200).json({
            success : true,
            message : `Delete ${deletedCount} user success`,
        });
    } catch (error) {
        if(!transaction.finished) {
            await transaction.rollback();
        }

        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
}