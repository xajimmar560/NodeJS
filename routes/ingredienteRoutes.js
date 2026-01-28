const express = require('express');
const router = express.Router();
const ingredienteController = require('../controllers/ingredienteController');

router.get('/', ingredienteController.getAllIngredientes);
router.get('/:id', ingredienteController.getIngredienteById);
router.post('/', ingredienteController.createIngrediente);
router.put('/:id', ingredienteController.updateIngrediente);
router.delete('/:id', ingredienteController.deleteIngrediente);

module.exports = router;