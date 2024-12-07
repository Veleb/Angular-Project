import mongoose from "mongoose";

export default function mongooseInit() {
  mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log(`Successfully connected to the DB!`))
  .catch((err) => console.log(`Error while connecting to the DB!`, err));

}