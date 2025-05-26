const express = require('express');
const { body, validationResult, param } = require('express-validator');
const sanitize = require('../middlewares/sanitize');
const StatusAoVivo = require('../models/maquinasAoVivo');
const fichaSiq = require('../models/fichaSiq');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, Authorization');
  res.header('x-forwarded-for', '*');
  next();
});

router.get('/buscar_ficha', async (req, res) => {
    try{
      const menuBuscar = await fichaSiq.findOne({ where: { id: 1 } });
      const menuStatus = await StatusAoVivo.findOne({ where: { id: 1 } });
      return res.status(200).json("Foi");
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Erro ao buscar o menu' });
    }
});
module.exports = router;