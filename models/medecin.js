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
      models.medecin.hasMany(models.consultation);
      models.medecin.hasMany(models.rdv);
    }
  }
  medecin.init(
    {
      nom_medecin: DataTypes.STRING,
      phone_medecin: DataTypes.INTEGER,
      num_ordre_medecin: DataTypes.INTEGER,
      specialisation_medecin: DataTypes.STRING,
      mail_medecin: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "medecin",
    }
  );
  return medecin;
};
