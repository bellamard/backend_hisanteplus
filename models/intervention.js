"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Intervention extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Intervention.belongsTo(models.Consultation, {
        foreignKey: {
          allowNull: false,
        },
      });
      models.Intervention.belongsTo(models.medecin, {
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  Intervention.init(
    {
      consultationId: DataTypes.INTEGER,
      medecinId: DataTypes.INTEGER,
      typeIntervention: DataTypes.STRING,
      nameIntervention: DataTypes.STRING,
      dateIntervention: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Intervention",
    }
  );
  return Intervention;
};
