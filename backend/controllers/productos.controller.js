// Aquí importamos todas las funciones (*) del archivo productos.model.js y lo llamaremos productosModel

import * as productosModel from "../models/productos.model.js"; 

export async function getProductos(req, res) {
  try {
    console.log('📦 Obteniendo productos...');
   
    const productos = await productosModel.obtenerTodos();
   
    res.status(200).json({
      success: true,
      message: `Se encontraron ${productos.length} productos`,
      data: productos
    });
   
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
}
