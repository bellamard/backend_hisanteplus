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
      nom_patient: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phone_patient: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      motpasse_patient: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      adresse_patient: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sexe_patient: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mail_patient: {
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
