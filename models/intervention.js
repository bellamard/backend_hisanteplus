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
      models.intervention.belongsTo(models.Consultation, {
        foreignKey: { allowNull: false },
      });
    }
  }
  intervention.init(
    {
      typeIntervention: DataTypes.STRING,
      consultationId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "intervention",
    }
  );
  return intervention;
};
