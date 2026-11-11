const express = require('express');
const router = express.Router();

const jogadorController = require('../controllers/jogadorController');
const auth = require('../middlewares/auth');

router.get('/jogadores', auth, jogadorController.listar);
router.post('/jogadores', auth, jogadorController.cadastrar);
router.delete('/jogadores/:id', auth, jogadorController.excluir);

module.exports = router;
