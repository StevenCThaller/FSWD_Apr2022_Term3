import jwt from 'jsonwebtoken';
import keys from '../configs/keys';
import User from '../models/user';

const requireAuth = async (req, res, next) => {
  const auth = req.get('authorization')

  if (!auth) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const token = auth.replace("Bearer ", "")

  jwt.verify(token, keys.secrets.jwt, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'you must be logged in' })
    }

    console.log(payload)
    const { sub } = payload
    User.findById(sub).then((userdata) => {
      req.user = userdata
      next()
    })
  })
}

export default requireAuth;