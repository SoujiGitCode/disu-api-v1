'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('shops', [
      {
        username: 'BurgerKing',
        shop_name: 'Burger King',
        email: 'bk@shops.com',
        status: 'active',
        discount: '10',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'MCDonalds',
        shop_name: 'McDonalds',
        email: 'mcdonalds@shops.com',
        status: 'active',
        discount: '20',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'KFCuserName',
        shop_name: 'KFC',
        email: 'kfc@shops.com',
        status: 'active',
        discount: '30',
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('shops', null, {});
  }
};
