import { Router } from 'express';
import requireAuth from '../middleware/requireAuth';
import ChatRoom from '../models/chatRoom';

const chatRoomsRoutes = Router();

chatRoomsRoutes.get('/', requireAuth, async (req, res, next) => {
  try {
    const id = req.user.id

    console.log(req.user)

    const rooms = await ChatRoom.find({ members: id })
      .populate('members')


    res.json(rooms)

  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default chatRoomsRoutes