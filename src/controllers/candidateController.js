const { Candidate, Setting, sequelize } = require("../models");
const fs = require("fs");
const path = require("path");

// ✨✨
exports.createCandidate = async (req, res) => {
    try {
        const { ketua_name, wakil_name, visi, misi} = req.body;

        if(!ketua_name || !wakil_name || !visi || !misi) {
            return res.status(400).json({
                success : false,
                message : "All Field are Required!!",
            });
        }

        if(!req.file) {
            return res.status(400).json({
                success : false,
                message : "Image Candidate Required!!",
            });
        };

        let image = null
        if(req.file) {
            image = `${req.protocol}://${req.get("host")}/uploads/image/${req.file.filename}`;
        }

        const candidate = await Candidate.create({
            ketua_name,
            wakil_name,
            visi,
            misi,
            image
        });

        return res.status(201).json({
            success : true,
            message : "Create Candidate Success",
            data : candidate
        });
    } catch (error) {
        console.error("Create Candidate ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// ✨✨
exports.getAllCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findAll({
            attributes : ["id_candidate", "ketua_name", "wakil_name", "visi", "misi", "image"],
            order : [["id_candidate", "ASC"]],
        });

        return res.status(200).json({
            success : true,
            message : "Get All Data Candidate Success",
            data : candidate,
        });
    } catch (error) {
        console.error("Get All Candidate ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server ERROR",
            error : error.message,
        });
    }
};
// ✨✨
exports.updateCandidate = async (req, res) => {
    try {
        const { id } = req.params;
        const { ketua_name, wakil_name, visi, misi } = req.body;

        const candidate = await Candidate.findByPk(id);

        if(!candidate) {

            if(req.file) {
                const filePath = path.join("uploads/image", req.file.filename);

                if(fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            };

            return res.status(404).json({
                success : false,
                message : "Candidate Not Found",
            });
        }

        let imageUrl = candidate.image;

        if(req.file) {
            const oldImagePath = path.join("uploads/image", path.basename(candidate.image));

            // delete old image in root project to new image
            if(fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            imageUrl = `${req.protocol}://${req.get("host")}/uploads/image/${req.file.filename}`;
        }

        await candidate.update({
            ketua_name,
            wakil_name,
            visi,
            misi,
            image : imageUrl,
        });

        return res.status(200).json({
            success : true,
            message : "Update Data Candidate Success",
            data : candidate,
        });
    } catch (error) {
        console.error("Update Candidate ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server ERROR",
            error : error.message,
        });
    }
}

// ✨✨
exports.deleteCandidate = async (req, res) => {
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
                message : "System Voting Is Open, Please Close Voting For Delete Candidate",
            });
        }

        const candidate = await Candidate.findByPk(id, {transaction});

        if(!candidate) {
            await transaction.rollback();
            return res.status(404).json({
                success : false,
                message : "Candidate Not Found",
            });
        }

        const imagePath = path.join("uploads/image", path.basename(candidate.image));

        await candidate.destroy({transaction});

        await transaction.commit();

        if(fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        };


        return res.status(200).json({
            success : true,
            message : "Delete Candidate Success",
        });
    } catch (error) {
        if(!transaction.finished) {
            await transaction.rollback();
        }

        console.error("Delete Candidate ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server ERROR",
            error : error.message,
        });
    }
};