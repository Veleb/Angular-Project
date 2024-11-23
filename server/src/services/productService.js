import Product from "../models/product.js";

const getAll = () => Product.find();
const getOne = (productId) => Product.findById(productId);
const create = (productData, userId) => Product.create({ ...productData, _ownerId: userId });
const remove = (productId) => Product.findByIdAndDelete(productId);
const update = (productId, productData) => Product.findByIdAndUpdate(productId, productData);


const productService = {
  getAll,
  getOne,
  create,
  remove,
  update
}

export default productService;