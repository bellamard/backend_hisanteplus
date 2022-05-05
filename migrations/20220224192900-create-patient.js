"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("patients", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nomPatient: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phonePatient: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      passwordPatient: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      adressPatient: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sexePatient: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mailPatient: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("patients");
  },
};
