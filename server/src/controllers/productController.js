import { Router } from "express";
import productService from "../services/productService.js";

const productController = Router();

productController.get("/saved", async (req, res) => {
  const userId = req.user?._id;
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User not authenticated." });
  }

  try {
    const response = await productService.getSavedProducts(userId);

    res.json(response);

  } catch (err) {
    res.status(400).json(err);
  }
});

productController.get("/", async (req, res) => {
  try {
    const response = await productService.getAll();
    res.json(response);
  } catch ({ message }) {
    res.status(400).json({ message });
  }
});

productController.get("/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const response = await productService.getOne(productId);

    if (!response) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(response);
  } catch ({ message }) {
    res.status(400).json({ message });
  }
});

productController.post("/", async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User not authenticated." });
  }

  const productData = req.body;

  try {
    const response = await productService.create(productData, userId);
    res.status(201).json(response);
  } catch ({ message }) {
    res.status(400).json({ message });
  }
});

productController.delete("/:productId", async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const response = await productService.remove(productId, userId);

    if (!response) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch ({ message }) {
    res.status(400).json({ message });
  }
});

productController.put("/:productId", async (req, res) => {
  const { productId } = req.params;
  const productData = req.body;

  try {
    const response = await productService.update(productId, productData);

    if (!response) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(response);
  } catch ({ message }) {
    res.status(400).json({ message });
  }
});

productController.post("/save/:productId", async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User not authenticated." });
  }

  try {

    const response = await productService.saveProduct(productId, userId);
    res.json(response);

  } catch ({ message }) {
    res.status(400).json({ message });
  }
});

productController.delete("/save/:productId", async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized. User not authenticated." });
  }

  try {
    const response = await productService.unsaveProduct(productId, userId);

    if (!response.newProduct || !response.user) {
      return res.status(404).json({ message: "Save or product not found" });
    }

    res.json(response);
  } catch ({ message }) {
    res.status(400).json({ message });
  }
});

export default productController;
