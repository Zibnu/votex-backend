module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define(
        "Setting",
        {
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
            paranoid : true
        },
    );
    return Setting;
}