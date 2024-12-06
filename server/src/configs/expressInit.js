import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

import { authMiddleware } from '../middlewares/authMiddleware.js'
import routes from "../routes.js";


export default function expressInit(app) {
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
}