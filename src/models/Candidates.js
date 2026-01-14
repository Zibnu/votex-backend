module.exports = (sequelize, DataTypes) => {
    const Candidate = sequelize.define(
        "Candidate", 
        {
            id_candidate : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true,
            },
            ketua_name : {
                type : DataTypes.STRING(50),
                allowNull : false,
            },
            wakil_name : {
                type : DataTypes.STRING(50),
                allowNull : false,
            },
            visi : {
                type : DataTypes.TEXT,
                allowNull : false,
            },
            misi : {
                type : DataTypes.TEXT,
                allowNull : false,
            },
            image : {
                type : DataTypes.TEXT,
                allowNull : false,
            },
        },
        {
            modelName : "Candidate",
            tableName : "candidates",
            timestamps : true,
            paranoid : true,
        }
    );

    Candidate.associate = (models) => {
        Candidate.hasMany(models.Vote, {foreignKey : "candidate_id", as : "votes"});
    };
    return Candidate;
};