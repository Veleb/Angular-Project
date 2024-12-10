import Product from "../models/product.js";
import User from "../models/User.js";
import { removePassword } from "../utils/auth.js";

const getAll = async () => {
  return await Product.find();
};

const getOne = async (productId) => {
  return await Product.findById(productId);
};

const create = async (productData, userId) => {
  const product = await Product.create({ ...productData, _ownerId: userId });
  
  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { userProducts: product._id } },
    { new: true }
  );

  return product;
};

const remove = async (productId, userId) => {
  try {
    await Product.findByIdAndDelete(productId);
    
    return await User.findByIdAndUpdate(
      userId, 
      { $pull: { userProducts: productId } },
      { new: true } 
    );

  } catch (err) {
    console.error('Error removing product from user:', err);
  }
};

const update = async (productId, productData) => {
  return await Product.findByIdAndUpdate(productId, productData, { new: true });
};

const saveProduct = async (productId, userId) => {
  const newUser = await User.findByIdAndUpdate(
    userId, 
    { $addToSet: { savedProducts: productId } },
    { new: true }
  ).lean();

  const newProduct = await Product.findByIdAndUpdate(
    productId, 
    { $addToSet: { savedBy: userId } },
    { new: true }
  ).lean();

  return { newProduct, user: removePassword(newUser) };
};

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

  return { newProduct, user: removePassword(newUser) };
};

const getSavedProducts = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate({ path: 'savedProducts', model: "Product" })
      .lean();

    const sortedProducts = (user.savedProducts || []).sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return sortedProducts;
  } catch (err) {
    console.error("Error fetching saved products:", err);
    throw err;
  }
};

const productService = {
  getAll,
  getOne,
  create,
  remove,
  update,
  saveProduct,
  unsaveProduct,
  getSavedProducts,

};

export default productService;
