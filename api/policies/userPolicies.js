module.exports = async function (req, res, next) {

    const userId = req.params.id
    if(req.user.id == userId || req.user.username === 'admin') return next()
    res.status(403).send("Forbidden")
  
  };