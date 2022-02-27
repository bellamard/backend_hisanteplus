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
      nom_medecin: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phone_medecin: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      num_ordre_medecin: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      specialisation_medecin: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      mail_medecin: {
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
