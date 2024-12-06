import express from "express";
import mongoose from "mongoose";
import routes from "./routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/authMiddleware.js";

import { createServer } from "http";
import { Server } from "socket.io";

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log(`Successfully connected to the DB!`))
  .catch((err) => console.log(`Error while connecting to the DB!`, err));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONT_END_URL,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`Connection was successful!`);
})

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(authMiddleware);
app.use(routes);

httpServer.listen(3030, () =>
  console.log(`Server is listening on ${process.env.BACK_END_URL}`)
);

// ✔️
