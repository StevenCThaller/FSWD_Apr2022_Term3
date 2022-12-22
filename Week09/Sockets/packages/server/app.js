import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import keys from './configs/keys';
import apiRoutes from './routes';
import errorHandler from './middleware/errorHandler';
import { Server } from 'socket.io'
import User from './models/user';
import ChatRoom from './models/chatRoom';

const PORT = keys.port;
const DB_URL = keys.db.url

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(_ => console.log("[Server] Connection Established"))
  .catch(err => console.log("[Server] Connection Failed", err))

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);
app.all("*", (req, res, next) => {
  next({ name: "NotFoundError" })
})
app.use(errorHandler)

const appServer = app.listen(PORT, () => console.log(`[Server] Listening on port ${PORT}`))

// Let's create our actual socket connection

const io = new Server(appServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  socket.emit("connected")
  console.log(socket)

  socket.on("handshake", async (uid) => {
    await User.findByIdAndUpdate(uid, { activeSocket: socket.id })
    const chatRooms = await ChatRoom.find({ members: uid })

  })

  socket.on("getMessages", async (roomId) => {
    if (roomId) {

      const room = await ChatRoom
        .findById(roomId)
        .populate({
          path: 'messages',
          populate: 'from'
        })

      socket.join(roomId)
      socket.emit("messagesLoaded", room.messages)
    }
  })

  socket.on("addFriend", async (body) => {
    const { from, to } = body
    // Add the "to" user to the "from" user's list of friends
    await User.findByIdAndUpdate(from, { $addToSet: { friends: to } })

    // Add the "from" user to the "to" user's list of friends
    await User.findByIdAndUpdate(to, { $addToSet: { friends: from } })
  })

  socket.on("connect", async (uid) => {
    const rooms = await ChatRoom.find({ members: uid })

    socket.emit("connected", rooms)
  })

  socket.on("createChatRoom", async (members) => {
    const newRoom = await ChatRoom.create({ members })
    const users = await User.find({ _id: { $in: members } })

    newRoom.members = users

    for (let user of users) {
      if (user.activeSocket && user.activeSocket !== socket.id) {
        socket.to(user.activeSocket).emit("chatCreated", newRoom)
      }
    }

    socket.emit("chatCreated", newRoom)
  })

  socket.on("disconnect", async () => {
    await User.findOneAndUpdate({ activeSocket: socket.id }, { activeSocket: null })
  })

  socket.on("typing", async ({ who, roomId }) => {
    const room = await ChatRoom
      .findById(roomId)
      .populate('members')

    for (let user of room.members) {
      if (user.username !== who) {
        socket.to(user.activeSocket).emit("otherUserTyping", who)
      }
    }
  })

  socket.on("send message", async ({ body, from, roomId }) => {
    console.log("message received from", from)
    const room = await ChatRoom
      .findByIdAndUpdate(roomId, { $addToSet: { messages: { body, from } } }, { new: true })
      .populate('members')

    console.log(room)

    for (let user of room.members) {
      socket.to(user.activeSocket).emit("receive message", { roomId, body, from })
    }
  })
})