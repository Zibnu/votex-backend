const {User, Vote, Candidate, Setting, sequelize} = require("../models");

exports.submitVote = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const userId = req.user.id_user;
        const { candidate_id } = req.body;

        if(!candidate_id) {
            await transaction.rollback();
            return res.status(400).json({
                success : false,
                message : "Please Select Your Candidate",
            });
        }

        const setting = await Setting.findOne({
            transaction,
            lock : transaction.LOCK.UPDATE
        });

        if(!setting || !setting.is_setting_open) {
            await transaction.rollback();
            return res.status(403).json({
                success : false,
                message : "Voting Is Closed",
            });
        }

        const user = await User.findOne({
            where : { id_user : userId },
            transaction,
            lock : transaction.LOCK.UPDATE,
        });

        if(!user) {
            await transaction.rollback();
            return res.status(404).json({
                success : false,
                message : "User Not Found",
            });
        }

        if (user.has_voted) {
            await transaction.rollback();
            return res.status(400).json({
                success : false,
                message : "User Already Voted",
            });
        }

        const candidate = await Candidate.findOne({
            where : { id_candidate : candidate_id },
            transaction,
        });

        if(!candidate) {
            await transaction.rollback();
            return res.status(404).json({
                success : false,
                message : "Candidate Not Found",
            });
        }

        await Vote.create({
            user_id : userId,
            candidate_id : candidate_id,
        }, {
            transaction
        });

        await user.update(
            {has_voted : true},
            {transaction},
        );

        await transaction.commit();

        return res.status(201).json({
            success : true,
            message : "Vote Submited Successfully",
        });
    } catch (error) {
        if(!transaction.finished) {
            await transaction.rollback();
        }
        console.error("Submit Vote ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message
        });
    }
};