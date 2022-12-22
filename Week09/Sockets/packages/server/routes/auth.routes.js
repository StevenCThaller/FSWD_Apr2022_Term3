import { Router } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import keys from '../configs/keys';

const authRoutes = Router();

authRoutes.post('/signup', async (req, res, next) => {
  try {
    const { username, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return res.status(422).json({ username: "Username already in use." })
    }

    if (!password) {
      return res.status(422).json({ password: "Password is required." })
    } else if (password.length < 8) {
      return res.status(422).json({ password: "Password must be at least 8 characters." })
    } else if (password.length > 20) {
      return res.status(422).json({ password: "Password cannot be longer than 20 characters." })
    } else if (!confirmPassword) {
      return res.status(422).json({ confirmPassword: "Must confirm password." })
    } else if (password !== confirmPassword) {
      return res.status(422).json({ password: "Passwords don't match." })
    }

    const passwordHash = bcrypt.hashSync(password, 12)

    const user = await User.create({ ...req.body, passwordHash })

    const userForToken = {
      sub: user._id,
      username
    }

    const token = jwt.sign(userForToken, keys.secrets.jwt)

    res.json({ token, uid: user._id, username: user.username })
  } catch (error) {
    next(error)
  }
})

authRoutes.post('/signin', async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).json({ username: "Invalid username/password" })
    }

    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash)

    if (!isPasswordValid) {
      return res.status(401).json({ username: "Invalid username/password" })
    }

    const userForToken = {
      sub: user._id,
      username
    }

    const token = jwt.sign(userForToken, keys.secrets.jwt)

    res.json({ token, uid: user._id, username })
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default authRoutes;