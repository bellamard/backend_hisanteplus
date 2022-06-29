"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Prescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Prescription.belongsTo(models.Consultation, {
        foreignKey: {
          allowNull: false,
        },
      });
      models.Prescription.hasMany(models.Medicament);
    }
  }
  Prescription.init(
    {
      consultationId: DataTypes.INTEGER,
      etatPrescription: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Prescription",
    }
  );
  return Prescription;
};
