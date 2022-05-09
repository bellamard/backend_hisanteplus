"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("interventions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      typeIntervention: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      consultationId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Consultations",
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
    await queryInterface.dropTable("interventions");
  },
};
