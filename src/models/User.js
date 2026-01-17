module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id_user : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true,
            },
            username : {
                type : DataTypes.STRING(50),
                allowNull : false,
                validate : {
                    notEmpty : true
                },
            },
            nisn : {
                type : DataTypes.STRING(20),
                allowNull : false,
                unique : true,
            },
            password : {
                type : DataTypes.UUID,
                defaultValue : DataTypes.UUIDV4,
                allowNull : false,
                unique : true,
            },
            role : {
                type : DataTypes.ENUM("user", "admin"),
                allowNull : false,
                defaultValue : "user",
            },
            has_voted : {
                type : DataTypes.BOOLEAN,
                allowNull : false,
                defaultValue : false,
            },
        },
        {
            modelName : "User",
            tableName : "users",
            timestamps : true,
            paranoid : true,
        },
    );
    User.associate = (models) => {
        User.hasOne(models.Vote, {foreignKey : "user_id", as : "vote"});
    };
    return User;
}