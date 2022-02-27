"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class rdv extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.rdv.belongsTo(models.patient, {
        foreignKey: { allowNull: false },
      });
      models.rdv.belongsTo(models.medecin, {
        foreignKey: { allowNull: false },
      });
    }
  }
  rdv.init(
    {
      id_patient: DataTypes.INTEGER,
      id_medecin: DataTypes.INTEGER,
      motif: DataTypes.STRING,
      date_heure_rdv: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "rdv",
    }
  );
  return rdv;
};
