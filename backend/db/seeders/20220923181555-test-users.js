'use strict';
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        firstName: 'Tony',
        lastName: 'Stark',
        email: 'tony.stark@gmail.com',
        username: 'tstark',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: 'Diana',
        lastName: 'Prince',
        email: 'diana.prince@gmail.com',
        username: 'dprince',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Clark',
        lastName: 'Kent',
        email: 'clark.kent@gmail.com',
        username: 'ckent',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Bruce',
        lastName: 'Wayne',
        email: 'bruce.wayne@gmail.com',
        username: 'bwayne',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'Selina',
        lastName: 'Kyle',
        email: 'selina.kyle@gmail.com',
        username: 'skyle',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@user.com',
        username: 'demo',
        hashedPassword: bcrypt.hashSync('password')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Users', {
      username: { [Op.in]: ['tstark', 'dprince', 'ckent', 'bwayne', 'skyle'] }
    }, {});
  }
};
