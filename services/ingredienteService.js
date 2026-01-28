const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const { deleteIngrediente } = require("../controllers/ingredienteController.js");
const models = initModels(sequelize);
const Ingrediente = models.ingrediente;

class IngredienteService{
    async getAllIngredientes() {
        const result = await Ingrediente.findAll();
    return result;
    }

    async getIngredienteByNombre(nombre){
        const result = await Ingrediente.findByPk(nombre);
        return result;
    }

    async createIngrediente(datos){
        const nuevo = await Ingrediente.create(datos);
        return nuevo;
    }

    async updateIngrediente(nombre, datos){
        const ingrediente = await Ingrediente.findByPk(nombre);
        if (ingrediente){
            await ingrediente.update(datos);
            return ingrediente;
        }
        return null;
    }

    async deleteIngrediente(nombre){
        const ingrediente = await Ingrediente.findByPk(nombre);
        if (ingrediente){
            await ingrediente.destroy();
            return true;
        }
        return false;
    }
}

module.exports = new IngredienteService();