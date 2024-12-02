import { Router } from "express";
import productService from "../services/productService.js";

const productController = Router();

productController.get('/', async (req, res) => {

  try {
    const response = await productService.getAll();

    res.json(response);
  } catch({ message }) {
    res.status(400).json({ message });
  }
})

productController.get('/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const response = await productService.getOne(productId);

    res.json(response);
  } catch({ message }) {
    res.status(400).json({ message });
  }
})

productController.post('/', async (req, res) => {
  const userId = req.user._id; // change thiz
  const productData = req.body;

    try {

        const response = await productService.create(productData, userId);
        res.json(response);
        
    } catch({ message }) {
        res.status(400).json({ message })
    }
})

productController.delete('/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {
        const response = await productService.remove(productId);
        res.json(response);
        
    } catch({ message }) {
        res.status(400).json({ message })
    }
})

productController.put('/:productId', async (req, res) => {
  const productId = req.params.productId;
  const productData = req.body;

  try {
      const response = await productService.update(productId, productData);
      res.json(response);
      
  } catch({ message }) {
      res.status(400).json({ message })
  }
})

productController.post('/save/:productId', async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user?._id;

  try {
    
    const response = await productService.saveProduct(productId, userId);

    res.json(response);

  } catch (err) {
    res.status(400).json("Error saving product: " + err.message);
  }
})

productController.delete('/save/:productId', async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user?._id;

  try {

    const response = await productService.unsaveProduct(productId, userId);

    res.json(response);

  } catch (err) {
    res.json("Error saving product: " + err.message);
  }
})

export default productController;