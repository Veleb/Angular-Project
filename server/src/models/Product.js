import { Schema, model, mongoose } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    minLength: 10,
  },
  _ownerId: {
     type: mongoose.Types.ObjectId, ref: "User" ,
  },
}) 

const Product = model('Product', productSchema);

export default Product;