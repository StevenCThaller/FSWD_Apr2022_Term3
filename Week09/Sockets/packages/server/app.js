import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import keys from './configs/keys';
import apiRoutes from './routes';
import errorHandler from './middleware/errorHandler';

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

app.listen(PORT, () => console.log(`[Server] Listening on port ${PORT}`))