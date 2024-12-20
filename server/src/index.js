import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import expressInit from "./configs/expressInit.js";
import mongooseInit from "./configs/mongooseInit.js";
import handleSocket from "./socket.js";

const app = express();
const httpServer = createServer(app);

let FRONT_END_URL = process.env.FRONT_END_URL_LOCAL;

if (process.env.PRODUCTION === true) {
  FRONT_END_URL = process.env.FRONT_END_URL_PROD;
}

const io = new Server(httpServer, {
  cors: {
    origin: FRONT_END_URL,
    credentials: true,
  },
});

expressInit(app);
mongooseInit();
handleSocket(io);

httpServer.listen(3030, () =>
  console.log(`Server is listening on ${process.env.BACK_END_URL}`)
);

// ✔️
