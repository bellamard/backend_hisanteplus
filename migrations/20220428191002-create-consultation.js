"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Consultations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      medecinId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "medecins",
          key: "id",
        },
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "patients",
          key: "id",
        },
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      valider: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      dateConsultation: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValues: Sequelize.Now,
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
    await queryInterface.dropTable("Consultations");
  },
};
