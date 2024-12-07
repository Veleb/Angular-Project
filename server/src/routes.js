import { Router } from 'express';
import productController from './controllers/productController.js';
import userController from './controllers/userController.js';
import roomController from './controllers/roomController.js';

const routes = Router();

routes.use("/products", productController);
routes.use("/users", userController);
routes.use('/rooms', roomController);

export default routes;
