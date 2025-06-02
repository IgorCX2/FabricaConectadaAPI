const express = require('express');
const { body, validationResult, query } = require('express-validator');
const sanitize = require('../middlewares/sanitize');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Departamento = require('../models/departamento');
const Cargo = require('../models/cargo');
const { Op } = require('sequelize');
const autorizacaoLogin = require('../middlewares/autorizacaoLogin')

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, Authorization');
  res.header('x-forwarded-for', '*');
  next();
});

router.post('/login', sanitize, body('codigo').trim().isLength({ min: 4 }).withMessage('O codigo deve ter pelo menos 4 caracteres'), body('senha').trim().isLength({ min: 4 }).withMessage('A senha deve ter pelo menos 4 caracteres'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg, status: 400 });
  }
  try {
    const usuario = await Usuario.findOne({
      where: { codigo_usuario: req.body.codigo },
      include: [
        {
          model: Cargo,
          as: 'cargo',
          attributes: ['cargo'],
          include: {
            model: Departamento,
            as: 'departamento',
            attributes: ['departamento', 'fabrica']
          }
        }
      ]
    });
    if (!usuario) {
      return res.status(400).json({ msg: 'Senha ou usuario incorreta', status:400 });
    }
    if (usuario.status !== 'ativo') {
      return res.status(403).json({ msg: 'Usuário inativo, bloqueado, ou com alguma ação em pendencia:' + usuario.status, status:403 });
    }
    const senhaValida = await bcrypt.compare(req.body.senha, usuario.senha);
    if (!senhaValida) {
      console.log('👀 Alguem Tentou acessar a sua conta' + req.body.codigo)
      return res.status(401).json({ msg: 'Senha ou usuario incorreta' , status:401});
    }
    const token = jwt.sign(
      {
        id: usuario.id,
        codigo_usuario: usuario.codigo_usuario,
        nome: usuario.nome,
        cargo_id: usuario.cargo_id,
        planta_principal: usuario.plantaPrincipal,
        perm: usuario.perm,
        perm_especial: usuario.perm_especial,
        perm_suprema: usuario.perm_suprema,
        cargo: usuario.cargo?.cargo,
        departamento: usuario.cargo?.departamento?.departamento,
        fabrica: usuario.cargo?.departamento?.fabrica,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000
    });
    return res.status(200).json({ msg: 'sucesso', status:200 });
  } catch (err) {
    console.error('⛔ Erro ao logar' + err);
    return res.status(500).json({ msg: 'Erro interno no servidor', status: 500 });
  }
});

router.post('/cadastro', sanitize, body('setor').trim(), body('local').trim(), body('nome').trim(), body('codigo').trim().isLength({ min: 5 }).withMessage('O codigo deve ter pelo menos 5 caracteres'), body('senha').trim().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'), body('confirmarSenha').trim().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg, status: 400 });
  }
  const { codigo, nome, senha, setor, local, confirmarSenha } = req.body;
  try {
    const usuarioExistente = await Usuario.findOne({ where: { codigo_usuario: codigo } });
    if (usuarioExistente) {
      return res.status(400).json({ msg: 'Código de usuário já está em uso' });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const status = "aprovar." + setor + "." + local
    const novoUsuario = await Usuario.create({ codigo_usuario: codigo, nome, senha: senhaHash, data_cadastro: new Date(), data_atualizacao: new Date(), status });
    return res.status(200).json({ msg: 'Cadastro bem-sucedido', status: 200 });
  } catch (err) {
    console.error('⛔ Erro ao cadastrar' + err);
    return res.status(500).json({ msg: 'Erro ao cadastrar o usuário', status: 500 });
  }
});

router.post('/atualizar-usuarios', autorizacaoLogin, sanitize, body('id').isInt({ min: 1 }).withMessage('Código inválido'), body('perm').trim().isLength({ min: 1 }).withMessage('Precisa ter alguma permissão'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg, status:400 });
  }
  const dados = req.body;
  console.log(req.body.status)
  if(req.body.status?.split('.')[0] == "aprovar"){
    return res.status(500).json({ msg: 'Tem que aprovar/desativar um usuario!', status:500 });
  }
  if(req.body.cargo_id == undefined && req.body.status == "ativo"){
    console.log("aqui")
    return res.status(500).json({ msg: 'Um usuario ativo precisa ter um cargo!', status:500 });
  }
  try {
    const usuario = await Usuario.findByPk(req.body.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado', status: 404 });
    }
    Object.entries(dados).forEach(([chave, valor]) => {
      if(chave != "id"){
        usuario[chave] = valor;
      }
    });
    await usuario.save();
    return res.status(200).json({ msg: 'Atualizado com sucesso', status: 200});
  } catch (err) {
    console.error('⛔ Erro ao atualizar o usuario:', err);
    return res.status(500).json({ msg: 'Erro ao atualizar o usuario', status: 500 });
  }

})

router.get('/usuarios', autorizacaoLogin, sanitize, query('status').trim().isLength({ min: 5 }).withMessage('O codigo deve ter pelo menos 5 caracteres'), query('departamento').trim().isLength({ min: 5 }).withMessage('O codigo deve ter pelo menos 5 caracteres'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg, status:400 });
  }
  try {
    const statusParam = req.query.status;
    const usuarios = await Usuario.findAll({
      where: {
        [Op.or]: [
          { status: statusParam },
          { '$cargo.departamento.departamento$': req.query.departamento }
        ]
      },
      include: [
        {
          model: Cargo,
          as: 'cargo',
          include: [
            {
              model: Departamento,
              as: 'departamento'
            }
          ]
        }
      ],
      attributes: ['id', 'nome', 'codigo_usuario', 'perm', 'perm_especial', 'perm_suprema', 'status']
    });

    res.json(usuarios);
  } catch (error) {
    console.error('⛔ Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários', status: 500 });
  }
});
module.exports = router;