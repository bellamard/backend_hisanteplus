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
      models.patient.hasMany(models.consultation);
      models.patient.hasMany(models.rdv);
    }
  }
  patient.init(
    {
      nom_patient: DataTypes.STRING,
      phone_patient: DataTypes.INTEGER,
      motpasse_patient: DataTypes.STRING,
      adresse_patient: DataTypes.STRING,
      sexe_patient: DataTypes.STRING,
      mail_patient: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "patient",
    }
  );
  return patient;
};
