"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Consultation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Consultation.belongsTo(models.medecin, {
        foreignKey: {
          allowNull: false,
        },
      }),
        models.Consultation.belongsTo(models.patient, {
          foreignKey: {
            allowNull: false,
          },
        });
    }
  }
  Consultation.init(
    {
      type: DataTypes.STRING,
      valider: DataTypes.BOOLEAN,
      dateConsultation: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Consultation",
    }
  );
  return Consultation;
};
