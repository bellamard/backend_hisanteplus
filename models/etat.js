"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class etat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.etat.belongsTo(models.patient, {
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  etat.init(
    {
      userId: DataTypes.INTEGER,
      systole: DataTypes.INTEGER,
      diastole: DataTypes.INTEGER,
      temperature: DataTypes.INTEGER,
      weight: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "etat",
    }
  );
  return etat;
};
