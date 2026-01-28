const initModels = require("../models/init-models.js").initModels;
const sequelize = require("../config/sequelize.js");
const { deleteCroqueta } = require("../controllers/croquetaController.js");
const models = initModels(sequelize);
const Croqueta = models.croqueta;
const Ingrediente = models.ingrediente;

class CroquetaService{
    async getAllCroquetas() {
        const result = await Croqueta.findAll();
    return result;
    }

    async getCroquetaById(nombre){
        const result = await Croqueta.findByPk(nombre);
        return result;
    }

    async createCroqueta(datos){
        const nueva = await Croqueta.create(datos);
        return nueva;
    }

    async updateCroqueta(nombre, datos){
        const croqueta = await Croqueta.findByPk(nombre);
        if (croqueta){
            await croqueta.update(datos);
            return croqueta;
        }
        return null;
    }

    async deleteCroqueta(nombre){
        const croqueta = await Croqueta.findByPk(nombre);
        if (croqueta){
            await croqueta.destroy();
            return true;
        }
        return false;
    }
}

module.exports = new CroquetaService();