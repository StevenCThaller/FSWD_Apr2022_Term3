import { Router } from 'express';
import requireAuth from '../middleware/requireAuth';
import User from '../models/user';

const chatRoomsRoutes = Router();

chatRoomsRoutes.get('/', requireAuth, async (req, res, next) => {
  try {
    const id = req.user.id

    console.log(req.user)

    const user = await User.findById(id)
      .populate({
        path: 'chatRooms',
        populate: {
          path: 'members',
          model: 'User'
        }
      })

    console.log(user)

    res.json(user.chatRooms)

  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default chatRoomsRoutes