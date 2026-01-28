const express = require('express');
const router = express.Router();
const croquetaController = require('../controllers/croquetaController');

router.use((req, res, next) => {
  console.log('➡️ Ruta croquetas:', req.method, req.originalUrl);
  next();
});
// GET /api/croquetas
router.get('/', croquetaController.getAllCroquetas);

// GET /api/croquetas/:nombre
router.get('/:nombre', croquetaController.getCroquetaById);

// POST /api/croquetas
router.post('/', croquetaController.createCroqueta);

// PUT /api/croquetas/:nombre
router.put('/:nombre', croquetaController.updateCroqueta);

// DELETE /api/croquetas/:nombre
router.delete('/:nombre', croquetaController.deleteCroqueta);

module.exports = router;

