'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IncidentLocation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      IncidentLocation.belongsTo(models.Incident, {
        foreignKey: 'incident_id'
      });
    }
  }
  IncidentLocation.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    incident_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    accuracy: DataTypes.FLOAT,
    recorded_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'IncidentLocation',
    tableName: 'incident_locations',
    underscored: true,
    updatedAt: false
  });
  return IncidentLocation;
};