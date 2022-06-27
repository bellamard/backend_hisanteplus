"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Interventions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      consultationId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Consultations",
          key: "id",
        },
      },
      medecinId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "medecins",
          key: "id",
        },
      },
      typeIntervention: {
        type: Sequelize.STRING,
      },
      nameIntervention: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      dateIntervention: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("Interventions");
  },
};
