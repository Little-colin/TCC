const express = require('express');
const router = express.Router();

const timeController = require('../controllers/timeController');
const auth = require('../middlewares/auth');

router.get('/times', auth, timeController.listar);
router.post('/times', auth, timeController.cadastrar);
router.delete('/times/:id', auth, timeController.excluir);

module.exports = router;