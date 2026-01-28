const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Croqueta = sequelize.define('croqueta', {
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    creacion: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    receta: {
      type:DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'croqueta',
    timestamps: false
  });

  return Croqueta;
};
