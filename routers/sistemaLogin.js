require('dotenv').config();
const bcrypt = require('bcryptjs/dist/bcrypt');
const cors = require('cors');
const createDOMPurify = require('dompurify');
const express = require('express');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { JSDOM } = require('jsdom');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const UsuarioIp = require('../models/usuarioIp');
const { where } = require('sequelize');
const EmpresasUrl = require('../models/empresasUrls');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, Authorization');
  res.header('x-forwarded-for', '*');
  router.use(cors());
  next();
});

router.post('/empresaBuscar', [body('ipUsuario').trim().notEmpty().isLength({ min: 10}).withMessage('O servidor não esta recuperando o IP do usuario')], async (req, res) => {
    console.log(req.body)
    const ipCliente = DOMPurify.sanitize(req.body.ipUsuario)
    try{
        const buscarIp = await UsuarioIp.findOne({
            where:{id: 1},
            include:[{
                model: EmpresasUrl,
                attributes: ['nome', 'url']
            }]
        })
        console.log(buscarIp.ip)
        console.log(buscarIp.empresaId)
        console.log(buscarIp.EmpresasUrl.nome)
        console.log(buscarIp.EmpresasUrl.url)
    }catch(error){
        console.log("erro")
    }
    return res.status(200).json({ msg: "ola" });
});
module.exports = router;