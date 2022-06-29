"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class authorization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.authorization.belongsTo(models.medecin, {
        foreignKey: {
          allowNull: false,
        },
      });
      models.authorization.belongsTo(models.patient, {
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  authorization.init(
    {
      medecinId: DataTypes.INTEGER,
      patientId: DataTypes.INTEGER,
      isAuthorized: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "authorization",
    }
  );
  return authorization;
};
