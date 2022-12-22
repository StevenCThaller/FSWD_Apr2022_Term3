import { Router } from 'express';
import authRoutes from './auth.routes';
import chatRoomsRoutes from './chatRooms.routes';
import usersRoutes from './users.routes';
import '../models/user';
import '../models/chatRoom';

const apiRoutes = Router();

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/chatrooms', chatRoomsRoutes);
apiRoutes.use('/users', usersRoutes);

export default apiRoutes;