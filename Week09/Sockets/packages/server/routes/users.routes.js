import { Router } from 'express';
import requireAuth from '../middleware/requireAuth';
import User from '../models/user';

const usersRoutes = Router()

usersRoutes.get('/', requireAuth, async (req, res, next) => {
  try {
    const { username } = req.query

    const users = await User.find({
      _id: {
        $ne: req.user._id
      },
      friends: {
        $ne: req.user._id
      },
      username: {
        $regex: username,
        $options: 'i'
      }
    })

    res.json(users)
  } catch (error) {
    console.log(error)
    next(error)
  }
})




export default usersRoutes;