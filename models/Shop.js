'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Shop extends Model { }

    Shop.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        shop_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 10.00
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'active'
        }
    }, {

        sequelize,
        modelName: 'Shop',
        tableName: 'shops',
        timestamps: true, // Sequelize añadirá los campos createdAt y updatedAt
        underscored: false // Convierte los campos camelCase en snake_case en la base de datos
    });

    return Shop;
};
