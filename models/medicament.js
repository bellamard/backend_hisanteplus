"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Medicament extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Medicament.belongsTo(models.Prescription, {
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  Medicament.init(
    {
      nameMedicament: DataTypes.STRING,
      dose: DataTypes.STRING,
      quantite: DataTypes.INTEGER,
      dosage: DataTypes.INTEGER,
      nombreprescriptionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Medicament",
    }
  );
  return Medicament;
};
