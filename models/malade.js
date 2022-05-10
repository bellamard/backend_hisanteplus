"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class malade extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.malade.belongsTo(models.Consultation, {
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  malade.init(
    {
      malady: DataTypes.STRING,
      level: DataTypes.STRING,
      consultationId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "malade",
    }
  );
  return malade;
};
