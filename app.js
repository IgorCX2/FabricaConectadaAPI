const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const rateLimiter = require('./middlewares/rateLimiter');
const app = express();

const whitelist = ['http://localhost:3000', 'https://aprendacomeduke.com.br'];

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
    if (!origin) {
      callback(null, false);
    } else if (whitelist.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      console.log(`Origin not allowed by CORS policy: ${origin}`);
      callback(new Error('Acesso negado pela política!'));
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

module.exports = app;