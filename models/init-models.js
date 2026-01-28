var DataTypes = require("sequelize").DataTypes;
var _croqueta = require("./croqueta");
var _ingrediente = require("./ingrediente");

function initModels(sequelize) {
    var croqueta = _croqueta(sequelize, DataTypes);
    var ingrediente = _ingrediente(sequelize, DataTypes);

    ingrediente.belongsTo(croqueta, {
        as: "croqueta",
        foreignKey: "receta",
        targetKey: "nombre"
    });

    croqueta.hasMany(ingrediente, {
        as: "ingredientes",
        foreignKey: "receta",
        sourceKey: "nombre"
    });

    return {
        croqueta,
        ingrediente,
    };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
