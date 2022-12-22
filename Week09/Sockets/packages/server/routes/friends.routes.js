import { Router } from 'express';
import requireAuth from '../middleware/requireAuth';
import User from '../models/user';

const friendsRoutes = Router()

friendsRoutes.get('/', requireAuth, async (req, res, next) => {
  try {
    const { username } = req.query
    if (username) {
      const users = await User.find({ $regex: { username: username, options: 'i' } })

      res.json(users)
    } else {

      const userWithFriends = await User.findById(req.user._id)
        .populate('friends')

      res.json(userWithFriends.friends)
    }
  } catch (error) {
    next(error)
  }
})

export default friendsRoutes;