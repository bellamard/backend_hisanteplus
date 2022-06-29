"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Remarque extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Remarque.belongsTo(models.patient, {
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  Remarque.init(
    {
      userId: DataTypes.INTEGER,
      nameRemarque: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Remarque",
    }
  );
  return Remarque;
};
