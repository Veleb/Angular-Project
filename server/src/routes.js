import { Router } from 'express';
import productController from './controllers/productController.js';
import userController from './controllers/userController.js';

const routes = Router();

routes.use("/products", productController);
routes.use("/users", userController);

export default routes;
