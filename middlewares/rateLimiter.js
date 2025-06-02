const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 1,
});
module.exports = (req, res, next) => {
    console.log(`• ${req.path}: ${req.method} (${req.ip})`);
    rateLimiter.consume(req.ip)
        .then(() => next())
        .catch(() => {
        res.status(429).json({ message: 'Muitas requisições. Tente novamente em breve.' });
    });
};