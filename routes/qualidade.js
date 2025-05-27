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

horarios = [
  { "dia": "segunda-feira", "turno": "1º", "inicio": "06:00", "fim": "14:36" },
  { "dia": "segunda-feira", "turno": "2º", "inicio": "14:36", "fim": "23:04" },
  { "dia": "segunda-feira", "turno": "3º", "inicio": "23:04", "fim": "06:00" },
  { "dia": "terça-feira", "turno": "1º", "inicio": "06:00", "fim": "14:36" },
  { "dia": "terça-feira", "turno": "2º", "inicio": "14:36", "fim": "23:04" },
  { "dia": "terça-feira", "turno": "3º", "inicio": "23:04", "fim": "06:00" },
  { "dia": "quarta-feira", "turno": "1º", "inicio": "06:00", "fim": "14:36" },
  { "dia": "quarta-feira", "turno": "2º", "inicio": "14:36", "fim": "23:04" },
  { "dia": "quarta-feira", "turno": "3º", "inicio": "23:04", "fim": "06:00" },
  { "dia": "quinta-feira", "turno": "1º", "inicio": "06:00", "fim": "14:36" },
  { "dia": "quinta-feira", "turno": "2º", "inicio": "14:36", "fim": "23:04" },
  { "dia": "quinta-feira", "turno": "3º", "inicio": "23:04", "fim": "06:00" },
  { "dia": "sexta-feira", "turno": "1º", "inicio": "06:00", "fim": "14:36" },
  { "dia": "sexta-feira", "turno": "2º", "inicio": "14:36", "fim": "23:00" },
  { "dia": "sexta-feira", "turno": "3º", "inicio": "23:00", "fim": "07:10" },
  { "dia": "sábado", "turno": "1º", "inicio": "07:10", "fim": "12:30" },
  { "dia": "sábado", "turno": "2º", "inicio": "12:30", "fim": "18:30" },
  { "dia": "domingo", "turno": "3º", "inicio": "23:05", "fim": "06:00" },
]

const traducao_dias = {
  monday: 'segunda-feira',
  tuesday: 'terça-feira',
  wednesday: 'quarta-feira',
  thursday: 'quinta-feira',
  friday: 'sexta-feira',
  saturday: 'sábado',
  sunday: 'domingo'
};

function getTurnoAtual(date) {
  const diaSemana = traducao_dias[date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()];
  const horaAtual = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');

  const turnosHoje = horarios.filter(h => h.dia === diaSemana);
  for (const turno of turnosHoje) {
    const inicio = turno.inicio;
    const fim = turno.fim;
    if (inicio < fim) {
      if (horaAtual >= inicio && horaAtual < fim) return turno.turno;
    } else {
      if (horaAtual >= inicio || horaAtual < fim) return turno.turno;
    }
  }
  return null;
}

// router.get('/buscar-ficha/:planta', sanitize, param('planta').isInt({ min: 1 }).withMessage('planta inválida'), async (req, res) => {
//   const agora = new Date();
//   const data_hoje = new Date(agora.setHours(23, 59, 59, 999));
//   const data_ontem = new Date();
//   data_ontem.setDate(data_hoje.getDate() - 1);
//   data_ontem.setHours(0, 0, 0, 0);
//     try{
//       const resultado = await fichaSiq.findAll({
//         where: {
//           planta: req.params.planta,
//           status: 'aberto',
//           data_abertura: {
//             [Op.between]: [data_ontem, data_hoje]
//           }
//         }
//       });
//       return res.status(200).json(resultado);
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json({ msg: 'Erro ao buscar o menu' });
//     }
// });
router.get('/buscar-ficha/:planta', sanitize, param('planta').isInt({ min: 1 }).withMessage('planta inválida'), async (req, res) => {
  const agora = new Date();
  const data_hoje = new Date(agora.setHours(23, 59, 59, 999));
  const data_ontem = new Date();
  data_ontem.setDate(data_hoje.getDate() - 1);
  data_ontem.setHours(0, 0, 0, 0);

  try {
    const resultado = await fichaSiq.findAll({
      where: {
        planta: req.params.planta,
        status: 'aberto',
        data_abertura: {
          [Op.between]: [data_ontem, data_hoje]
        }
      }
    });

    const turnoAtual = getTurnoAtual(new Date());

    const indicadores = {
      nao_finalizados: 0,
      turno_diferente: 0,
      quantidade: resultado.length,
      quantidade_fechado: 0
    };

    for (const ficha of resultado) {
      if (ficha.tipo === 'liberacao') {
        indicadores.nao_finalizados++;

        const turnoAbertura = getTurnoAtual(new Date(ficha.data_abertura));
        if (turnoAbertura !== turnoAtual) {
          indicadores.turno_diferente++;
        }
      }

      if (ficha.liberacao) {
        indicadores.quantidade_fechado++;
      }
      if (ficha.f01) {
        indicadores.quantidade_fechado++;
      }
      if (ficha.t01) {
        indicadores.quantidade_fechado++;
      }
    }

    return res.status(200).json({
      fichas: resultado,
      indicadores
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Erro ao buscar fichas' });
  }
});

router.patch('/ficha-siq/:codigo', param('codigo').isInt({ min: 1 }).withMessage('Código inválido'),
  body().custom(value => {
    const camposPermitidos = ['t01', 'f01', 'liberacao', 'comentario'];
    const chaves = Object.keys(value);
    return chaves.every(k => camposPermitidos.includes(k));
  }).withMessage('Campos inválidos no corpo da requisição'),
  async (req, res) => {
    const { codigo } = req.params;
    const dados = req.body;
    try {
      const ficha = await fichaSiq.findByPk(codigo);
      if (!ficha) {
        return res.status(404).json({ msg: 'Ficha não encontrada' });
      }
      Object.entries(dados).forEach(([chave, valor]) => {
        ficha[chave] = valor;
      });
      await ficha.save();
      return res.status(200).json({ msg: 'Atualizado com sucesso', ficha });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Erro ao atualizar a ficha' });
    }
  }
);
module.exports = router;