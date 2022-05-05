"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.patient.hasMany(models.Consultation);
    }
  }
  patient.init(
    {
      nomPatient: DataTypes.STRING,
      phonePatient: DataTypes.INTEGER,
      passwordPatient: DataTypes.STRING,
      adressPatient: DataTypes.STRING,
      sexePatient: DataTypes.STRING,
      mailPatient: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "patient",
    }
  );
  return patient;
};
