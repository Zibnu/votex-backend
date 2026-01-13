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
            },
            role : {
                type : DataTypes.ENUM("user", "admin"),
                allowNull : false,
                defaultValue : "user",
            },
        },
        {
            tableName : "users",
            timestamps : true,
            paranoid : true,
        },
    );
    User.associate = (models) => {
        //for relasi table
    };
    return User;
}