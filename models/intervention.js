"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class intervention extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.intervention.belongsTo(models.malade, {
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  intervention.init(
    {
      maladeId: DataTypes.INTEGER,
      typeIntervention: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "intervention",
    }
  );
  return intervention;
};
