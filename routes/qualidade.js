const express = require('express');
const { body, validationResult, param } = require('express-validator');
const sanitize = require('../middlewares/sanitize');
const StatusAoVivo = require('../models/maquinasAoVivo');
const fichaSiq = require('../models/fichaSiq');
const autorizacaoLogin = require('../middlewares/autorizacaoLogin');
const { Op } = require('sequelize');
const getTurnoAtual = require('../utils/turnoAtual');
const itemsPecas = require('../models/itemsPeca');
const { gerarExcel } = require('../utils/imprimirFichaSiq');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, Authorization');
  res.header('x-forwarded-for', '*');
  next();
});

router.get('/buscar-ficha/:planta', autorizacaoLogin, sanitize, param('planta').trim().isLength({ min: 5 }).withMessage('planta inválida'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg, status: 400 });
  }
  const agora = new Date();
  const data_hoje = new Date(agora.setHours(23, 59, 59, 999));
  const data_ontem = new Date();
  data_ontem.setDate(data_hoje.getDate() - 10);
  data_ontem.setHours(0, 0, 0, 0);
  try {
    const alertas = await itemsPecas.findAll({
      where: {
        alerta: true
      },
      attributes: ['itemFabrica']
    });
    const resultado = await fichaSiq.findAll({
      where: {
        planta: req.params.planta,
        status: {
          [Op.in]: ['aberto', 'finalizado']
        },
        data_abertura: {
          [Op.between]: [data_ontem, data_hoje]
        }
      }
    });
    const turnoAtual = getTurnoAtual()
    const indicadores = {
      nao_finalizados: 0,
      turno_diferente: 0,
      quantidade: resultado.length,
      quantidade_fechado: 0,
      precisam_fazer: 0
    };

    for (const ficha of resultado) {
      if (ficha.tipo != 'Revalidacao' && ficha.status == 'aberto') {
        indicadores.nao_finalizados++;

        const turnoAbertura = getTurnoAtual(new Date(ficha.data_abertura));
        if (turnoAbertura !== turnoAtual) {
          indicadores.turno_diferente++;
        }
      }

      if (ficha.tipo != 'Revalidacao' && ficha.liberacao) {
        indicadores.quantidade_fechado++;
      }
      if (ficha.tipo == 'Revalidacao' && ficha.f01 && ficha.t01) {
        indicadores.quantidade_fechado++;
      }
    }
    indicadores.precisam_fazer = indicadores.quantidade - indicadores.quantidade_fechado
    return res.status(200).json({
      fichas: resultado,
      indicadores,
      alertas: alertas
    });

  } catch (err) {
    console.error('⛔ Erro ao buscar fichas' + err);
    return res.status(500).json({ msg: 'Erro ao buscar fichas' });
  }
});

router.post('/atualizar-ficha', autorizacaoLogin, sanitize, async (req, res) => {
  const camposPermitidos = ['t01', 'f01', 'liberacao', 'comprovante']
  const { id, campo, valor } = req.body
  if (!id || !campo) {
    return res.status(400).json({ msg: 'ID e campo são obrigatórios', status: 400 })
  }
  if (!camposPermitidos.includes(campo)) {
    return res.status(400).json({ msg: 'Campo não permitido', status: 400 })
  }
  try {
    const atualizacao = { [campo]: valor }
    if (campo === "liberacao") {
      atualizacao.status = 'finalizado'
    }
    const [atualizados] = await fichaSiq.update(atualizacao, {
      where: { id: id },
    })
    if (atualizados === 0) {
      return res.status(404).json({ msg: 'Ficha não encontrada', status: 404 })
    }
    res.json({ ok: true })
  } catch (err) {
    console.error('⛔ Erro ao atualizar ficha:', err)
    res.status(500).json({ msg: 'Erro ao atualizar no banco', status: 500 })
  }
})
router.get('/imprimir-ficha/:planta', autorizacaoLogin, sanitize, param('planta').trim().isLength({ min: 5 }).withMessage('planta inválida'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg, status: 400 });
  }
  try {
    const caminhoArquivo = await gerarExcel(req.params.planta);
    return res.download(caminhoArquivo, 'FichaPlanta.xlsx');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Erro ao gerar o Excel' });
  }
})

module.exports = router;