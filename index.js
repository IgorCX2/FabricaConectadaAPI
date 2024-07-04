const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const https = require('https');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const Middleware = require('./middleware/segurancaMiddleware');
const whitelist = ['http://localhost:3000', 'https://aprendacomeduke.com.br', undefined];

const app = express();
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
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`Acesso negado pela política!: ${origin}`);
        callback(new Error('Acesso negado pela política!'));
      }
    },
  })
);

app.use(Middleware)
app.use('/api/sistemaLogin', require('./routers/sistemaLogin'));

const PORT = 8181;
app.listen(PORT, () => console.log(`Servidor iniciado na porta ${PORT}`));