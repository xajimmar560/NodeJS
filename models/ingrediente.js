const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Ingrediente = sequelize.define('ingrediente', {
        ingrediente: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true
        },
        receta: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'croqueta',
                key: 'receta'
            }
        },
        preprocesado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
        }
    }, {
        tableName: 'ingrediente',
        timestamps: false,
        indexes: [
        {
            name: 'receta',
            using: 'BTREE',
            fields: [{ name: 'receta' }]
        }
        ]
    });

    return Ingrediente;
};
