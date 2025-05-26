const express = require('express');
const { body, validationResult } = require('express-validator');
const sanitize = require('../middlewares/sanitize');
const Usuario = require('../models/usuarios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, Authorization');
  res.header('x-forwarded-for', '*');
  next();
});

router.post('/login', sanitize, body('codigo').trim().isLength({ min: 5 }).withMessage('O codigo deve ter pelo menos 5 caracteres'), body('senha').trim().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }
    try{
      const usuario  = await Usuario.findOne({ where: { codigo_usuario: req.body.codigo } });
      if (!usuario) {
        return res.status(400).json({ msg: 'Senha ou usuario incorreta' });
      }
      if (usuario.status !== 'ativo'){
        return res.status(403).json({ msg: 'Usuário inativo, bloqueado, ou com alguma ação em pendencia:'+usuario.status });
      }
      const senhaValida = await bcrypt.compare(req.body.senha, usuario.senha);
      if (!senhaValida){
        return res.status(401).json({ msg: 'Senha ou usuario incorreta' });
      }
      const token = jwt.sign(
        {
          id: usuario.id,
          codigo_usuario: usuario.codigo_usuario,
          nome: usuario.nome,
          cargo_id: usuario.cargo_id,
          perm: usuario.perm,
          perm_especial: usuario.perm_especial,
          perm_suprema: usuario.perm_suprema,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const tokenFront = jwt.sign(
        {
          nome: usuario.nome,
          perm: usuario.perm,
          perm_especial: usuario.perm_especial,
          perm_suprema: usuario.perm_suprema,
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
      console.log("Fori")
      return res.status(200).json({ msg: tokenFront });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Erro interno no servidor' });
    }
});

router.post('/cadastro', sanitize, body('setor').trim(),body('local').trim(),body('nome').trim(), body('codigo').trim().isLength({ min: 5 }).withMessage('O codigo deve ter pelo menos 5 caracteres'), body('senha').trim().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'), body('confirmarSenha').trim().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }
    const { codigo, nome, senha, setor, local, confirmarSenha } = req.body;
    try{
      const usuarioExistente = await Usuario.findOne({ where: { codigo_usuario: codigo } });
      if (usuarioExistente) {
        return res.status(400).json({ msg: 'Código de usuário já está em uso' });
      }
      const senhaHash = await bcrypt.hash(senha, 10);
      const status = "aprovar."+setor+"."+local
      const novoUsuario = await Usuario.create({codigo_usuario: codigo, nome, senha: senhaHash, data_cadastro: new Date(), data_atualizacao: new Date(),status});
      return res.status(200).json({ msg: 'Cadastro bem-sucedido' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Erro ao cadastrar o usuário' });
    }
});
module.exports = router;