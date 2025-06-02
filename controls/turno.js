const sequelize = require("../config/database/sistema");
const Turno = require("../models/turnos");

const horarios = [
  { dia: "segunda-feira", turno: "1º", inicio: "06:00", fim: "14:36" },
  { dia: "segunda-feira", turno: "2º", inicio: "14:36", fim: "23:04" },
  { dia: "segunda-feira", turno: "3º", inicio: "23:04", fim: "06:00" },
  { dia: "terça-feira", turno: "1º", inicio: "06:00", fim: "14:36" },
  { dia: "terça-feira", turno: "2º", inicio: "14:36", fim: "23:04" },
  { dia: "terça-feira", turno: "3º", inicio: "23:04", fim: "06:00" },
  { dia: "quarta-feira", turno: "1º", inicio: "06:00", fim: "14:36" },
  { dia: "quarta-feira", turno: "2º", inicio: "14:36", fim: "23:04" },
  { dia: "quarta-feira", turno: "3º", inicio: "23:04", fim: "06:00" },
  { dia: "quinta-feira", turno: "1º", inicio: "06:00", fim: "14:36" },
  { dia: "quinta-feira", turno: "2º", inicio: "14:36", fim: "23:04" },
  { dia: "quinta-feira", turno: "3º", inicio: "23:04", fim: "06:00" },
  { dia: "sexta-feira", turno: "1º", inicio: "06:00", fim: "14:36" },
  { dia: "sexta-feira", turno: "2º", inicio: "14:36", fim: "23:00" },
  { dia: "sexta-feira", turno: "3º", inicio: "23:00", fim: "07:10" },
  { dia: "sábado", turno: "1º", inicio: "07:10", fim: "12:30" },
  { dia: "sábado", turno: "2º", inicio: "12:30", fim: "18:30" },
  { dia: "domingo", turno: "3º", inicio: "23:05", fim: "06:00" },
];

async function inserirTurnos() {
  await sequelize.sync();
  await Turno.bulkCreate(horarios);
  console.log('Turnos inseridos com sucesso.');
}

inserirTurnos().catch(console.error);
