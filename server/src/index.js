import express from 'express';
import mongoose from 'mongoose';
import routes from './routes.js';
import cors from 'cors';

mongoose
  .connect("mongodb://127.0.0.1:27017/marketplace")
  .then(() => console.log(`Successfully connected to the DB!`))
  .catch((err) => console.log(`Error while connecting to the DB!`, err));

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(3030, () => console.log('Server is listening on http://localhost:3030'));

// ✔️