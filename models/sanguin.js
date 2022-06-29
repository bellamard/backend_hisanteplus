"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sanguin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.sanguin.belongsTo(models.patient, {
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  sanguin.init(
    {
      userId: DataTypes.INTEGER,
      rhesus: DataTypes.STRING,
      electrophorese: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "sanguin",
    }
  );
  return sanguin;
};
