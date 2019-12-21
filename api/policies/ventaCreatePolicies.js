module.exports = function (req, res, next) {
    req.body.user_id = req.user.id
    next()
}