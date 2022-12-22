import { Router } from 'express';
import requireAuth from '../middleware/requireAuth';
import User from '../models/user';

const usersRoutes = Router()

usersRoutes.get('/', requireAuth, async (req, res, next) => {
  try {
    const users = await User.find({ $not: { _id: req.user._id } })
    res.json(users)
  } catch (error) {
    next(error)
  }
})


export default usersRoutes;