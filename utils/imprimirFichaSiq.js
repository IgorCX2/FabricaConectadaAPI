const ExcelJS = require('exceljs');
const path = require('path');
const fichaSiq = require('../models/fichaSiq');
const StatusAoVivo = require('../models/maquinasAoVivo');
const { Op } = require('sequelize');
const itemsPecas = require('../models/itemsPeca');

const workbookPath = path.join(__dirname, '../models/excel/ModeloSiq.xlsx');
const novoPath = path.join(__dirname, '../models/excel/ModeloSiqEnviar.xlsx');
const codigosStatusParda = ['0707', '9992', '0304', '0303', '0302', '0003', '0704', '0802', '0703', '0006', '1206', '0903', '0710', '0704', '0414', '0405', '0406', '0407', '0305', '0419', '0420', '0421', '0422', '0713', '1101', '0707', '0002', '0505', '0722', '0201']

async function gerarExcel(planta) {
    try {
        const agora = new Date();
        const data_hoje = new Date(agora.setHours(23, 59, 59, 999));
        const data_ontem = new Date();
        data_ontem.setDate(data_hoje.getDate() - 10);
        data_ontem.setHours(0, 0, 0, 0);

        const testeMaquina = ["I-1867", "I-1868", "I-1943", "I-1943-A", "P-I-002-H", "P-I-002-I", "I-1190", "I-1406", "I-1406-A", "I-1406-B", "I-1406-C", "I-160-D", "I-1799", "I-1800", "I-1835", "I-1835-A", "I-1875", "I-1876", "I-740", "I-1641", "I-1641-A", "I-1641-B", "I-1746", "I-881", "I-1944", "I-493", "I-493-A", "I-493-B", "I-493-C", "I-690", "I-1533", "I-1534", "I-1613", "I-1645", "I-1744", "I-1825", "I-1826", "I-1827", "I-1840", "I-1841", "I-1842", "I-1873", "I-1874", "I-570", "I-571", "I-1078", "I-1080", "I-1611", "I-1611-A", "I-1620", "I-1659", "I-1660", "I-1775", "I-1816", "I-1817", "I-1829", "I-1830", "I-1836", "I-287-C", "I-287-D", "I-287-F", "I-1384", "I-1532", "I-160-F", "I-1663", "I-1725", "PE-1403-A", "PE-1506", "PE-1507", "PH-794", "PM-10", "PM-10-B", "PME-795", "CP-693", "CP-693-A", "EX-696", "MC-1429", "EX-696", "MC-1429", 'ES-1781', 'ES-1861', 'EST-1486',]
        var localApu = []
        if (planta == "moldados") {
            localApu = [
                "MM-500T APU 1", "MM-500T APU 2", "MM-500T APU 3", "MM-500T APU 4",
                "MM-500T APU 5", "MM-500T APU 6", "MM-500T APU 7", "MM-500T APU 8", 'MM-EXT']
        }
        if (planta == "oring") {
            localApu = ['APU2-ORING', 'APU1-ORING']
        }
        if (planta == "retentores") {
            localApu = ['RT-ACA', 'PL-INJ']
        }
        if (planta == "freios") {
            localApu = ['APU2-FREIOS']
        }
        const fichaSiqAbertas = await fichaSiq.findAll({
            where: {
                planta: planta,
                status: {
                    [Op.in]: ['aberto', 'finalizado']
                },
                data_abertura: {
                    [Op.between]: [data_ontem, data_hoje]
                }
            }
        });
        const siqs = await itemsPecas.findAll({
            where: {
                siq: true
            },
            attributes: ['itemFabrica']
        });
        const Maquinaslistas = await StatusAoVivo.findAll({
            where: {
                resourcecode: {
                    [Op.in]: testeMaquina
                },
                supLevel2Code: {
                    [Op.in]: localApu
                }
            }
        })
        Maquinaslistas.sort((a, b) => {
            return testeMaquina.indexOf(a.resourcecode) - testeMaquina.indexOf(b.resourcecode);
        });
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(workbookPath);
        const sheet = workbook.getWorksheet('Impressão');
        for (let i = 0; i < Maquinaslistas.length; i++) {
            const linha = 5 + (i % 41);
            const extra = i >= 41;
            const d = Maquinaslistas[i];
            const ficha = fichaSiqAbertas.find(ficha => ficha.resourcecode == d.resourcecode)
            const col = extra ? {
                SN: 'P', res: 'Q', sup: 'R', prod: 'T', wohd: 'U', user: 'Y', rsname: 'AB', QTD: 'Z', l: 'X', f: 'W', i: 'V', siq: 'S'
            } : {
                SN: 'A', res: 'B', sup: 'C', prod: 'E', wohd: 'F', user: 'J', rsname: 'M', QTD: 'K', l: 'I', f: 'H', i: 'G', siq: 'D'
            };

            sheet.getCell(`${col.res}${linha}`).value = d.resourcecode;
            sheet.getCell(`${col.sup}${linha}`).value = d.supLevel2Code?.slice(-1);

            if (ficha) {
                sheet.getCell(`${col.prod}${linha}`).value = ficha.prodcode;
                sheet.getCell(`${col.wohd}${linha}`).value = ficha.wohdcode;
                sheet.getCell(`${col.user}${linha}`).value = d.userstartedstatus;
                sheet.getCell(`${col.rsname}${linha}`).value = ficha.statusPCF;
                sheet.getCell(`${col.QTD}${linha}`).value = ficha.qtd;
                var cor = 'FF000000'
                if (codigosStatusParda.includes(ficha.statusPCF)) {
                    if (ficha.tipo == 'Revalidacao') {
                        cor = 'FF4EA72E';
                    } else {
                        cor = 'FFFFC000';
                    }
                } else {
                    if (ficha.tipo == 'Revalidacao') {
                        cor = 'FF00B050';
                    } else {
                        cor = 'FFFFFF00';
                    }
                }
                const celulaSN = sheet.getCell(`${col.SN}${linha}`);
                celulaSN.style = {};
                celulaSN.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: cor }
                };
                const celulaSiq = sheet.getCell(`${col.siq}${linha}`);
                celulaSiq.style = {};
                if (siqs.find(alerta => alerta.itemFabrica === ficha.prodcode)) {
                    celulaSiq.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF4169E1' }
                    };
                }
                sheet.getCell(`${col.l}${linha}`).value = ficha.liberacao ? '⬤' : '';
                sheet.getCell(`${col.f}${linha}`).value = ficha.f01 ? '⬤' : '';
                sheet.getCell(`${col.i}${linha}`).value = ficha.t01 ? '⬤' : '';
            }
        }
        await workbook.xlsx.writeFile(novoPath);
        return novoPath;
    } catch (err) {
        console.error('⛔ Erro ao gerar Excel:', err);
    }
}
module.exports = { gerarExcel };
