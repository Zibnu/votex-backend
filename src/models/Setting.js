module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define(
        "Setting",
        {
            id_setting : {
                type : DataTypes.INTEGER,
                primaryKey : true,
                autoIncrement : true,
            },
            is_setting_open : {
                type : DataTypes.BOOLEAN,
                allowNull : false,
                defaultValue : false,
            },
        },
        {
            modelName : "Setting",
            tableName : "setting",
            timestamps : true,
            paranoid : false
        },
    );
    return Setting;
}