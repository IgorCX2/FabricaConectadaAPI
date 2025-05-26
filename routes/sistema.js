const express = require('express');
const { body, validationResult, param } = require('express-validator');
const sanitize = require('../middlewares/sanitize');
const Menu = require('../models/menu');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, Authorization');
  res.header('x-forwarded-for', '*');
  next();
});

router.get('/menu/:id', sanitize, param('id').isInt({ min: 1 }).withMessage('ID inválido'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }
    try{
      const menuBuscar = await Menu.findOne({ where: { id: req.params.id } });
      if (!menuBuscar) {
        return res.status(400).json({ msg: 'Este menu não existe' });
      }
      return res.status(200).json(menuBuscar);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Erro ao buscar o menu' });
    }
});

router.get("/modulos", async (req, res) => {
  try {
    const modulos = await Menu.findAll({
      attributes: ["departamentos", "id"]
    });
    const resultado = modulos.map((modulo) => ({
      
      modulos: [modulo.departamentos, modulo.departamentos[0].toUpperCase()+modulo.id]
    }));
    res.json(resultado);
  } catch (error) {
    console.error("Erro ao buscar módulos:", error);
    res.status(500).json({ error: "Erro ao buscar módulos" });
  }
});
module.exports = router;