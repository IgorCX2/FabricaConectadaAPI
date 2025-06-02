const express = require('express');
const { query, validationResult, param } = require('express-validator');
const sanitize = require('../middlewares/sanitize');
const Menu = require('../models/menu');
const Departamento = require('../models/departamento');
const autorizacaoLogin = require('../middlewares/autorizacaoLogin');
const Cargo = require('../models/cargo');
const getTurnoAtual = require('../utils/turnoAtual');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, Authorization');
  res.header('x-forwarded-for', '*');
  next();
});

router.get('/turno-atual', async (req, res) => {
  try {
    const turno = await getTurnoAtual();
    if (turno) {
      res.json(turno);
    } else {
      res.status(404).json({ msg: 'Turno atual não encontrado', status: 404 });
    }
  } catch (error) {
    console.error('⛔ Erro ao buscar turno' + error);
    res.status(500).json({ msg: 'Erro interno', status: 500 });
  }
});

router.get('/menu/:id', autorizacaoLogin, sanitize, param('id').isInt({ min: 1 }).withMessage('ID inválido'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }
  try {
    const menuBuscar = await Menu.findOne({ where: { id: req.params.id } });
    if (!menuBuscar) {
      return res.status(400).json({ msg: 'Este menu não existe', status: 400 });
    }
    return res.status(200).json(menuBuscar);
  } catch (err) {
    console.error('⛔ Erro ao menu/id' + err);
    return res.status(500).json({ msg: 'Erro ao buscar o menu', status: 500 });
  }
});

router.get("/modulos", autorizacaoLogin, async (req, res) => {
  try {
    const modulos = await Menu.findAll({
      attributes: ["departamentos", "id"]
    });
    const resultado = modulos.map((modulo) => ({
      modulos: ['modulos', modulo.departamentos, modulo.departamentos[0].toUpperCase() + modulo.id]
    }));
    res.json(resultado);
  } catch (error) {
    console.error('⛔ Erro ao buscar modulos' + error);
    res.status(500).json({ error: "Erro ao buscar módulos" , status: 500});
  }
});

router.get('/cargos', autorizacaoLogin, sanitize, query('departamento').trim().isLength({ min: 5 }).withMessage('Minimo de 5 digitos no departamento'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg });
  }
  try {
    const cargos = await Cargo.findAll({
      include: {
        model: Departamento,
        as: 'departamento',
        where: {
          departamento: req.query.departamento,
        },
        attributes: ['id', 'departamento', 'fabrica', 'centro_custo'],
      },
      attributes: ['id', 'cargo', 'responsavel'],
    });

    res.json(cargos);
  } catch (error) {
    console.error('Erro ao buscar cargos:', error);
    res.status(500).json({ error: 'Erro ao buscar cargos do departamento' , status: 500});
  }
});

router.get('/departamentos', async (req, res) => {
  try {
    const locaisRaw = await Departamento.findAll({
      attributes: [[Departamento.sequelize.fn('DISTINCT', Departamento.sequelize.col('fabrica')), 'fabrica']],
      raw: true,
    });
    const setoresRaw = await Departamento.findAll({
      attributes: [[Departamento.sequelize.fn('DISTINCT', Departamento.sequelize.col('departamento')), 'departamento']],
      raw: true,
    });

    const locais = locaisRaw.map(item => item.fabrica);
    const setores = setoresRaw.map(item => item.departamento);

    res.json({ locais, setores });
  } catch (error) {
    console.error('⛔ Erro ao buscar departamento' + error);
    res.status(500).json({ error: 'Erro interno', status: 500 });
  }
});

router.get('/menu-departamento', autorizacaoLogin, query('departamento').trim().isLength({ min: 5 }).withMessage('O departamento deve ter pelo menos 5 caracteres'), async (req, res) => {
  const { departamento } = req.query;
  try {
    const menus = await Menu.findAll({
      where: {
        departamentos: departamento,
      },
      attributes: ['id', 'nomeMenu', 'cor'],
    });

    res.json(menus);
  } catch (err) {
    console.error('Erro ao buscar menus:', err);
    res.status(500).json({ error: 'Erro interno do servidor', status: 500 });
  }
});
module.exports = router;