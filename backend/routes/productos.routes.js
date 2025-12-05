import {Router} from "express";
import * as productosController from "../controllers/productos.controller.js"

const productosRoutes = Router();

//Petición GET 
productosRoutes.get ("/", productosController.getProductos)

export default productosRoutes;