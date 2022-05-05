"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("medecins", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nomMedecin: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phoneMedecin: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      passwordMedecin: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      numOrdreMedecin: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      specialisationMedecin: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mailMedecin: {
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
    await queryInterface.dropTable("medecins");
  },
};
