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
  const limit = req.query['limit'];

  try {

    const response = await productService.getAll(limit);
    res.json(response);

  } catch (err) {
    res.status(400).json(err);
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
  } catch (err) {
    res.status(400).json(err);
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
  } catch (err) {
    res.status(400).json(err);
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
  } catch (err) {
    res.status(400).json(err);
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
  } catch (err) {
    res.status(400).json(err);
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

  } catch (err) {
    res.status(400).json(err);
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
  } catch (err) {
    res.status(400).json(err);
  }
});

productController.delete('/delete/user', async (req, res) => {
  const userId = req.user?._id;
  
  try {
    
    const response = await productService.deleteUserProducts(userId);
    
    res.status(200).json(response);

  } catch (err) {
    res.status(400).json(err);
  }
})

export default productController;
