const { User, Vote, Candidate, sequelize } = require("../models");

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
                total_votes : vote ? parseInt(vote.dataValues.total_votes) : 0
            };
        });

        const chartData = {
            total : totalUser,
            voted : totalVoted,
            not_voted : totalNotVoted
        };

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