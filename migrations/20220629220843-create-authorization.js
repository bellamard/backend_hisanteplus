"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("authorizations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      medecinId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "medecins",
          key: "id",
        },
      },
      patientId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "patients",
          key: "id",
        },
      },
      isAuthorized: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("authorizations");
  },
};
