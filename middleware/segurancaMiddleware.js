async function Middleware(req, res, next){
    console.log("verificarSegurança")
    console.log(req.headers['x-forwarded-for'])
    console.log(req.body)
    return next()
}
module.exports = Middleware;