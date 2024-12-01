import Product from "../models/product.js";
import User from '../models/User.js';
import { removePassword } from '../utils/auth.js';

const getAll = () => Product.find();
const getOne = (productId) => Product.findById(productId);
const create = (productData, userId) => Product.create({ ...productData, _ownerId: userId });
const remove = (productId) => Product.findByIdAndDelete(productId);
const update = (productId, productData) => Product.findByIdAndUpdate(productId, productData);

const saveProduct = async (productId, userId) => {
  const newUser = await User.findByIdAndUpdate(
    userId, 
    { $addToSet: { savedProducts: productId } },
    { new: true }
  ).lean();

  const newProduct= await Product.findByIdAndUpdate(
    productId, 
    { $addToSet: { savedBy: userId } },
    { new: true }
  ).lean();

  const response = { newProduct, user: removePassword(newUser) }

  return response;
}

const unsaveProduct = async (productId, userId) => {
  const newUser = await User.findByIdAndUpdate(
    userId, 
    { $pull: { savedProducts: productId } },
    { new: true }
  ).lean();

  const newProduct = await Product.findByIdAndUpdate(
    productId, 
    { $pull: { savedBy: userId } },
    { new: true }
  ).lean();
  
  const response = { newProduct, user: removePassword(newUser) }

  return response;
}

const productService = {
  getAll,
  getOne,
  create,
  remove,
  update,
  saveProduct,
  unsaveProduct,

}

export default productService;