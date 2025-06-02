const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rateLimiter = require('./middlewares/rateLimiter');
const app = express();

const whitelist = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "http://localhost:3000"],
    },
  },
  frameguard: { action: 'deny' },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  xssFilter: true,
  noSniff: true,
}));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, origin);
    } else {
      console.log(`⛔ Origin not allowed by CORS policy: ${origin}`);
      callback(new Error('Acesso negado pela política de CORS!'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiter);

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/sistema', require('./routes/sistema'));

app.use('/api/qualidade', require('./routes/qualidade'));
// app.use('/api/manutencao', require('./routes/manutencao'));


module.exports = app;