const express = require('express');
const router = express.Router();

const campeonatoController = require('../controllers/campeonatoController');
const auth = require('../middlewares/auth');

router.get('/campeonatos', auth, campeonatoController.listar);
router.post('/campeonatos', auth, campeonatoController.cadastrar);
router.delete('/campeonatos/:id', auth, campeonatoController.excluir);

module.exports = router;