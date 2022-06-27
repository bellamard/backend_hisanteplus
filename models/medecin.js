"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class medecin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.medecin.hasMany(models.Consultation);
      models.medecin.hasMany(models.Intervention);
    }
  }
  medecin.init(
    {
      nomMedecin: DataTypes.STRING,
      phoneMedecin: DataTypes.INTEGER,
      passwordMedecin: DataTypes.STRING,
      numOrdreMedecin: DataTypes.INTEGER,
      specialisationMedecin: DataTypes.STRING,
      mailMedecin: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "medecin",
    }
  );
  return medecin;
};
