const croquetaService = require('../services/croquetaService');
const { logMensaje } = require("../utils/logger.js");

class croquetaController {

    async getAllCroquetas(req, res) {
        try {
            const croquetas = await croquetaService.getAllCroquetas();
            return res.status(200).json({
                ok: true,
                datos: croquetas,
                mensaje: "Croquetas recuperadas correctamente",
            });
        } catch (err) {
            logMensaje("Error en getAllCroquetas:", err);
            return res.status(500).json({
                ok: false,
                datos: null,
                mensaje: "Error al recuperar croquetas",
            });
        }
    }

    async createCroqueta(req, res) {
        const croqueta = req.body;
        try {
            const croqueatNew = await croquetaService.createCroqueta(croqueta);
            return res.status(201).json({
                ok: true,
                datos: croqueatNew,
                mensaje: "Croqueta creada correctamente",
            });
        } catch (err) {
            logMensaje("Error en createCroqueta:", err);
            return res.status(500).json({
                ok: false,
                datos: null,
                mensaje: "Error al crear una croqueta",
            });
        }
    }

    async deleteCroqueta(req, res) {
        const id_croqueta = req.params.nombre;
        try {
            // El servicio devuelve true o false, no numFilas
            const borrado = await croquetaService.deleteCroqueta(id_croqueta);

            if (!borrado) {
                return res.status(404).json({
                    ok: false,
                    datos: null,
                    mensaje: "Croqueta no encontrada: " + id_croqueta,
                });
            } else {
                return res.status(204).send(); // 204 No Content
            }
        } catch (err) {
            logMensaje("Error en deleteCroqueta:", err);
            return res.status(500).json({
                ok: false,
                datos: null,
                mensaje: "Error al borrar una croqueta",
            });
        }
    }

    async updateCroqueta(req, res) {
        const id_croqueta = req.params.nombre;
        const croquetaData = req.body;

        try {
            // El servicio devuelve el objeto o null
            const croquetaActualizada = await croquetaService.updateCroqueta(id_croqueta, croquetaData);

            if (!croquetaActualizada) {
                return res.status(404).json({
                    ok: false,
                    datos: null,
                    mensaje: "Croqueta no encontrada: " + id_croqueta,
                });
            } else {
                return res.status(204).send();
            }
        } catch (err) {
            logMensaje("Error en updateCroqueta:", err);
            return res.status(500).json({
                ok: false,
                datos: null,
                mensaje: "Error al editar una croqueta",
            });
        }
    }

    async getCroquetaById(req, res) {
        const id_croqueta = req.params.nombre;
        try {
            // Faltaba el 'const' aquí
            const croqueta = await croquetaService.getCroquetaById(id_croqueta);
            
            if (croqueta) {
                return res.status(200).json({
                    ok: true,
                    datos: croqueta,
                    mensaje: "Croqueta recuperada correctamente",
                });
            } else {
                return res.status(404).json({
                    ok: false,
                    datos: null,
                    mensaje: "Croqueta no encontrada",
                });
            }
        } catch (err) {
            logMensaje("Error en getCroquetaById:", err);
            return res.status(500).json({
                ok: false,
                datos: null,
                mensaje: "Error al recuperar una croqueta",
            });
        }
    }
}

module.exports = new croquetaController();