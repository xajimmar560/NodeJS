const ingredienteService = require('../services/ingredienteService');
const { logMensaje } = require("../utils/logger.js");
class ingredienteController{


    async getAllIngredientes(req, res) {
    try {
        const ingredientes = await ingredienteService.getAllIngredientes();
        return res.status(200).json({
            ok: true,
            datos: ingredientes,
            mensaje: "Ingredientes recuperados correctamente",
        });
        } catch (err) {
            logMensaje("Error en getAllIngredientes:", err);
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: "Error al recuperar ingredientes",
        });
        }
    }

    async createIngrediente(req, res) {
    const ingrediente = req.body;

    try {
        const ingredienteNew = await ingredienteService.createIngrediente(ingrediente);

        return res.status(201).json({
            ok: true,
            datos: ingredienteNew,
            mensaje: "Ingrediente creado correctamente",
        });
        } catch (err) {
        logMensaje("Error en createIngrediente:", err);
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: "Error al crear un ingrediente",
        });
        }
    }

    async deleteIngrediente(req, res) {
    const id_ingrediente = req.params.ingrediente;

    try {
        const numFilas = await ingredienteService.deleteIngrediente(id_ingrediente);

        if (numFilas == 0) {
        return res.status(404).json({
            ok: false,
            datos: null,
            mensaje: "Ingrediente no encontrado: " + id_ingrediente,
            });
        } else {
            // Borrado correcto
            return res.status(204).send();
        }
        } catch (err) {
        logMensaje("Error en deleteIngrediente:", err);
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: "Error al borrar un ingrediente",
        });
        }
    }

    async updateIngrediente(req, res) {
    const id_ingrediente = req.params.nombre;
    const ingrediente = req.body;

    try {
        const numFilas = await ingredienteService.updateIngrediente(ingrediente);

        if (numFilas == 0) {
        // No se ha encontrado lo que se quería actualizar o no hay nada que cambiar
        return res.status(404).json({
            ok: false,
            datos: null,
            mensaje: "Ingrediente no encontrado: " + id_ingrediente,
        });
        } else {
        // Al dar status 204 no se devuelva nada
        res.status(204).send();
        }
        } catch (err) {
        logMensaje("Error en updateIngrediente:", err);
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: "Error al editar un ingrediente",
        });
    }
    }

    async getIngredienteById(req, res) {
    const id_ingrediente = req.params.nombre;
    try {
        ingrediente = await ingredienteService.getIngredienteById(id_ingrediente);
        if (ingrediente) {
        return res.status(200).json({
            ok: true,
            datos: croqueta,
            mensaje: "Ingrediente recuperado correctamente",
        });
        } else {
            return res.status(404).json({
            ok: false,
            datos: null,
            mensaje: "Ingrediente no encontrado",
            });
        }
        } catch (err) {
        logMensaje("Error en getIngredienteById:", err);
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: "Error al recuperar un ingrediente",
        });
        }
    }

}
module.exports = new ingredienteController();