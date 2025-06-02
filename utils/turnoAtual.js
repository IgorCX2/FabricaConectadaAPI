const { Op } = require('sequelize');
const Turno = require("../models/turnos");


function formatHoraMinuto(date) {
  return date.toTimeString().slice(0, 5);
}

function diaDaSemanaString(dia) {
  return ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'][dia];
}


/**
 @param {Date} [dataReferencia]
 @returns {Promise<Turno|null>}
 */

async function getTurnoAtual(dataReferencia = new Date()) {
  const horaAgora = formatHoraMinuto(dataReferencia);
  const diaAtual = diaDaSemanaString(dataReferencia.getDay());
  const diaAnterior = diaDaSemanaString((dataReferencia.getDay() + 6) % 7); 

  const turnos = await Turno.findAll({
    where: {
      dia: {
        [Op.in]: [diaAtual, diaAnterior]
      }
    }
  });
  for (const turno of turnos) {
    const { inicio, fim, dia } = turno;

    if (inicio < fim) {
      if (horaAgora >= inicio && horaAgora < fim && dia === diaAtual) {
        return turno;
      }
    } else {
      const cruzouVirada = (horaAgora >= inicio || horaAgora < fim);
      const correspondeDia = (dia === diaAtual || dia === diaAnterior)
      if (cruzouVirada && correspondeDia) {
        return turno;
      }
    }
  }
  return null;
}

module.exports = getTurnoAtual;