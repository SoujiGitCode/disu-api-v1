'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Transaction extends Model { }

    Transaction.init({
        init_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        discount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        final_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Transaction',
        tableName: 'transactions',
        timestamps: true,
        underscored: false
    });

    Transaction.associate = function (models) {
        // asocia Transaction con User
        Transaction.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        // asocia Transaction con Shop
        Transaction.belongsTo(models.Shop, {
            foreignKey: 'shop_id',
            as: 'shop'
        });
    };


    return Transaction;
};