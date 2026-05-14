const { User, Vote, Candidate, sequelize, Setting } = require("../models");
const PDFDocument = require("pdfkit");

exports.dashboard = async (req, res) => {
    try {
        const totalUser = await User.count({
            where : { role : "user" },
        });

        const totalVoted = await User.count({
            where : { has_voted : true },
        });

        const totalNotVoted = totalUser - totalVoted;

        const totalCandidate = await Candidate.count();

        const percentage = totalUser === 0 ? 0 : ((totalVoted / totalUser) * 100 ).toFixed(2);

        const votesRaw = await Vote.findAll({
            attributes : [
                "candidate_id",
                [sequelize.fn("COUNT", sequelize.col("candidate_id")), "total_votes"]
            ],
            group : ["candidate_id"]
        });

        const candidates = await Candidate.findAll({
            attributes : ["id_candidate", "ketua_name", "wakil_name"],
            order : [["id_candidate", "ASC"]]
        });

        const votesPerCandidate = candidates.map((candidate) => {
            const vote = votesRaw.find(
                (v) => v.candidate_id === candidate.id_candidate
            );

            return {
                id_candidate : candidate.id_candidate,
                ketua_name : candidate.ketua_name,
                wakil_name : candidate.wakil_name,
                total_votes : vote ? parseInt(vote.dataValues.total_votes) : 0,
            };
        });

        const chartData = {
            total : totalUser,
            voted : totalVoted,
            not_voted : totalNotVoted
        };

        const setting = await Setting.findOne({
            attributes : ["is_setting_open"]
        });

        return res.status(200).json({
            success : true,
            message : "Get Data Dashboard Success",
            data : {
                totalUser,
                totalVoted,
                totalNotVoted,
                totalCandidate,
                percentage,
                votesPerCandidate,
                chartData,
                isVotingOpen : setting.is_setting_open
            },
        });
    } catch (error) {
        console.error("Get Data Dashboard ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};

exports.exportVotingPDF = async (req, res) => {
    try {
        const setting = await Setting.findOne();
        if(setting.is_setting_open) {
            return res.status(403).json({
                success : false,
                message : "System Voting Is Open, Please Close For Export Voting Result!!"
            })
        }

        const candidates = await Candidate.findAll({
            attributes : ["id_candidate", "ketua_name", "wakil_name"],
            order : [["id_candidate", "ASC"]],
        });

        const voteRaw = await Vote.findAll({
            attributes : [
                "candidate_id",
                [sequelize.fn("COUNT", sequelize.col("candidate_id")), "total_votes"]
            ],
            group : ["candidate_id"]
        });

        const results = candidates.map((candidate) => {
            const vote = voteRaw.find((v) => 
                Number(v.candidate_id) === Number(candidate.id_candidate)
            );
            return {
                candidate_name : `${candidate.ketua_name} & ${candidate.wakil_name}`,
                total_votes : vote ? parseInt(vote.dataValues.total_votes) : 0
            };
        });

        const winner = results.length > 0 
        ? results.reduce((prev, current) => {
            return current.total_votes > prev.total_votes ? current : prev;
        }) : null;

        const doc = new PDFDocument({
            margin : 50,
            size : "A4",
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=votex-result.pdf");

        doc.pipe(res);

        doc.fontSize(22).text("Laporan Hasil Voting Votex", { align : "center" });
        doc.moveDown(2);

        doc.fontSize(12).text(`Tanggal Export : ${new Date().toLocaleString()}`);
        doc.moveDown(2);

        doc.fontSize(16).text("Hasil Perolehan Suara");
        doc.moveDown();

        results.forEach((result, index) => {
            doc.fontSize(13).text(`${index + 1}. ${result.candidate_name} : ${result.total_votes} suara`);
            doc.moveDown(0.5);
        });
        doc.moveDown(2);

        doc.fontSize(18).text(`Pemenang Pemilihan Ketua & Wakil Osis SMK Islam Al Amanah Salem Tahun ${new Date().getFullYear()}`, {
            underline : true,
        });
        doc.moveDown();

        if(winner) {
            doc.fontSize(14).text(`Nama Kandidat : ${winner.candidate_name}`);
            doc.fontSize(14).text(`Total Suara : ${winner.total_votes} suara`);
        } else {
            doc.fontSize(14).text("Belum Ada Data Pemenang");
        }
        doc.moveDown(3);

        doc.fontSize(10).text(
            "Generate by Votex System",
            {
            align : "center",
        });
        doc.end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "Internal Server ERROR",
            error : error.message,
        });
    }
};