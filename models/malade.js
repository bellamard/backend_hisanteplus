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
      // define association
      models.malade.belongsTo(models.Consultation, {
        foreignKey: {
          allowNull: false,
        },
      }),
        models.malade.hasMany(models.intervention);
    }
  }
  malade.init(
    {
      malady: DataTypes.STRING,
      consultationId: DataTypes.INTEGER,
      niveau: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "malade",
    }
  );
  return malade;
};
