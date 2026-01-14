module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define(
        "Vote",
        {
            id_vote : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true,
            },
            user_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
                unique : true, //1 user hanya bisa 1x vote
                references : {
                    model : "users",
                    key : "id_user",
                },
            },
            candidate_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
                references : {
                    model : "candidates",
                    key : "id_candidate",
                },
            },
        },
        {
            modelName : "Vote",
            tableName : "votes",
            timestamps : true,
            paranoid : true,
        }
    );

    Vote.associate = (models) => {
        Vote.belongsTo(models.User, {
            foreignKey : "user_id",
            as : "user",
        });

        Vote.belongsTo(models.Candidate, {
            foreignKey : "candidate_id",
            as : "candidate",
        });
    };
    return Vote;
}