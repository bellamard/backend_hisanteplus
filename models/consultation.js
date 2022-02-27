"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class consultation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.consultation.belongsTo(models.patient, {
        foreignKey: { allowNull: false },
      });
      models.consultation.belongsTo(models.medecin, {
        foreignKey: { allowNull: false },
      });
    }
  }
  consultation.init(
    {
      id_patient: DataTypes.INTEGER,
      id_medecin: DataTypes.INTEGER,
      motif_consultation: DataTypes.STRING,
      date_consultation: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "consultation",
    }
  );
  return consultation;
};
