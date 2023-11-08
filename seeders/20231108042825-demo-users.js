'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar datos de prueba en la tabla 'users'
    await queryInterface.bulkInsert('users', [
      {
        username: 'souji',
        name: 'Reinaldo',
        last_name: 'Cardenas',
        dni: '21437163',
        email: 'souji@example.com',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'juanM',
        name: 'Juan',
        last_name: 'Mejias',
        dni: '87654321',
        email: 'juan@example.com',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'Kevin',
        name: 'Kevin',
        last_name: 'C',
        dni: '22654321',
        email: 'kevin@example.com',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Puedes agregar más usuarios aquí si lo necesitas
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Eliminar todos los datos de la tabla 'users'
    await queryInterface.bulkDelete('users', null, {});
  }
};
