const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    const token = req.headers["x-access-token"]; // "Bearer TOKEN"
    // console.log(`found token is ${token}`)
    if (!token) {
      return res.status(401).json({ message: 'Нет авторизации' })
    }

    // const decoded = jwt.verify(token, config.get('jwtToken'))
    // console.log(`config token decoded ${decoded}`)
    // req.user = decoded

    jwt.verify(token, config.get('jwtToken'), (err, decoded_data) => {
      if (err) return res.status(401).send({error:err, message:err.message})
      req.auth_user = decoded_data
    });

    next()

  } catch (e) {
    res.status(401).json({ message: e.message })
  }
}
