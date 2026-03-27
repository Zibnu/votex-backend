const { Candidate } = require("../models");
const fs = require("fs");
const path = require("path");

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