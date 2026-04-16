const { Vote, User, Setting, sequelize } = require("../models");
// ✨✨
exports.getSetting = async (req, res) => {
    try {
        const setting = await Setting.findOne();

        return res.status(200).json({
            success : true,
            message : `Get Setting Info Success`,
            data : setting,
        });
    } catch (error) {
        console.error("Get Setting ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : error.message,
        });
    }
};
// ✨✨
exports.toogleVoting = async (req, res) => {
    try {
        let setting = await Setting.findOne();

        if(!setting) {
            setting = await Setting.create({
                is_setting_open : true,
            });
        } else {
            await setting.update({
                is_setting_open : !setting.is_setting_open,
            });
        }

        return res.status(200).json({
            success : true,
            message : `Voting is Now ${setting.is_setting_open ? "Open" : "Closed"}`,
            data : setting,
        });
    } catch (error) {
        console.error("Toogle Voting ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server ERROR",
            error : error.message,
        });
    }
};

exports.resetVoting = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const setting = await Setting.findOne();

        if(setting && setting.is_setting_open) {
            await transaction.rollback();
            return res.status(400).json({
                success : false,
                message : "Cannot reset while voting is Open",
            });
        };

        await Vote.destroy({
            where : {},
            force : true,
            transaction,
        });

        await User.update(
            {has_voted : false},
            {where : {}, transaction},
        );

        await transaction.commit();

        return res.status(200).json({
            success : true,
            message : "Voting  has beenn reset Successfully",
        });
    } catch (error) {
        if(!transaction.finished) {
            await transaction.rollback();
        }
        console.error("Reset Voting ERROR", error);
        return res.status(500).json({
            success : false,
            message : "Internal Server ERROR",
            error : error.message,
        });
    }
};