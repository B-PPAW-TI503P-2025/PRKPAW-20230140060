'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
  
    static associate(models) {
  
      this.belongsTo(models.User, {
        foreignKey: 'userId', 
        as: 'user'           
      });
    }
  }
  Presensi.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
      references: {
        model: 'Users', 
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
   
    
    checkIn: {
      type: DataTypes.DATE, 
      allowNull: false,
      defaultValue: DataTypes.NOW 
    },
    checkOut: {
      type: DataTypes.DATE, 
      allowNull: true,      
    }
  }, {
    sequelize,
    modelName: 'Presensi',
  });
  return Presensi;
};