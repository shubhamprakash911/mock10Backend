const jwt = require("jsonwebtoken")

const authentication = (req, res, next) => {
    let token = req.headers.authorization
    if (!token) {
        return res.status(401).send({ message: "Token not found" })
    }

    jwt.verify(token, process.env.secretKey, (err, decoded) => {
        if (decoded) {
            next()
        } else if(err) {
            return res.status(200).send({ Message: "something went wrong",error:err.message });
        }
    })
}

module.exports = {authentication};