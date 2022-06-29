"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Medicaments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nameMedicament: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      dose: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      quantite: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      dosage: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      nombreprescriptionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Prescriptions",
          key: "id",
        },
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
    await queryInterface.dropTable("Medicaments");
  },
};
