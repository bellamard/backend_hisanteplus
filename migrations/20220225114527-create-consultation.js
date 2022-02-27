"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("consultations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_patient: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "patients",
          key: "id",
        },
      },
      id_medecin: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "medecins",
          key: "id",
        },
      },
      motif_consultation: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      date_consultation: {
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
    await queryInterface.dropTable("consultations");
  },
};
