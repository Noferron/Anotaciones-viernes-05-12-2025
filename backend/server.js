/**
 * @module server
 * @requires express
 *
 * @description
 * Servidor principal de la API "Bazar" construido con Express.
 * - Express se instala con npm (por ejemplo: `npm install express`) y se importa
 *   en el código (p. ej. `import express from 'express'`). Express es un
 *   framework ligero sobre Node.js que facilita la creación de servidores HTTP,
 *   manejo de rutas, middlewares y parsing de cuerpos (JSON, urlencoded, etc.).
 *
 * @remarks
 * - Este archivo configura middlewares globales (CORS, parser de JSON),
 *   registra rutas agrupadas por recursos y maneja errores.
 * - Devuelve una instancia de aplicación Express (app) que escucha en el puerto
 *   configurado en las variables de entorno o 3001 por defecto.
 *
 * @example
 * // Inicio del servidor:
 * // app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
 *
 * @note Sobre req.method y req.path (explicación para el middleware de logging)
 * - req.method:
 *   - Origen: proviene del objeto Request que Express construye a partir del
 *     objeto IncomingMessage de Node.js. Node.js parsea la petición HTTP y
 *     expone el método (GET, POST, PUT, DELETE, etc.) como una propiedad.
 *   - ¿Para qué sirve?: indica el verbo HTTP de la petición entrante. Es útil
 *     para registro (logging), control de flujo en middlewares (por ejemplo,
 *     permitir solo ciertos métodos) y para implementar lógica condicionada
 *     según el tipo de operación solicitada.
 *
 * - req.path:
 *   - Origen: lo proporciona Express al procesar la URL de la petición. Es la
 *     ruta de la URL sin la parte de query string (sin los parámetros después de
 *     `?`). Internamente Express deriva esta información de req.url y la normaliza.
 *   - ¿Para qué sirve?: representa el camino solicitado en la aplicación (por
 *     ejemplo, `/api/productos/123`). Se utiliza frecuentemente en logging,
 *     enrutamiento y para tomar decisiones en middlewares (por ejemplo,
 *     registrar accesos a rutas específicas o excluir ciertas rutas del
 *     procesamiento).
 *
 * @usage
 * - En el middleware de logging (como el usado en este archivo) se suele leer
 *   `req.method` y `req.path` para escribir una línea de log simple con el
 *   verbo y la ruta, por ejemplo: "GET /api/productos".
 *
 * @exports app
 */
// server.js
// IMPORTANTE: Cargar variables de entorno ANTES que cualquier otra importación
import 'dotenv/config';  // Carga automáticamente las variables del .env
 
import express from 'express';
import cors from 'cors';
 
// Importar rutas del sistema
import productosRoutes from './routes/productos.routes.js';
import authRoutes from './routes/auth.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
 
/**
 * ==========================================
 * 🚀 SERVIDOR EXPRESS - BAZAR
 * ==========================================
 *
 * Sistema completo de gestión de bazar:
 * - Servidor Express con arquitectura MVC
 * - Autenticación JWT para usuarios
 * - API REST con endpoints organizados
 * - Sistema de middleware para protección
 */
 
const app = express();
const PORT = process.env.PORT || 3001;
 
// ==========================================
// MIDDLEWARES DE LA APLICACIÓN
// ==========================================
 
// CORS - Configuración para desarrollo
// OPCIÓN 1: Autorización universal (SOLO PARA DESARROLLO)
app.use(cors({
  origin: '*', // Permite cualquier origen - útil durante desarrollo
  credentials: false // Deshabilitado para compatibilidad con origin: '*'
}));
 
// OPCIÓN 2: Configuración específica (RECOMENDADO PARA PRODUCCIÓN)
// Descomenta las siguientes líneas y comenta la configuración anterior para producción:
/*
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // URLs específicas del frontend
  credentials: true // Permite cookies y headers de autenticación
}));
*/
 
// NOTA
// - origin: '*' permite cualquier dominio conectarse a tu API
// - Es cómodo para desarrollo pero INSEGURO para producción
// - En producción, especifica los dominios exactos que pueden acceder
// - credentials: true permite envío de cookies/tokens pero requiere origins específicos
 
// Parser de JSON
app.use(express.json());
 
// Middleware de logging para desarrollo
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
 
// ==========================================
// RUTAS DE LA API
// ==========================================
 
// Ruta de salud del servidor
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Servidor API Bazar funcionando!',
    timestamp: new Date().toISOString()
  });
});
 
// Rutas de la API
app.use('/api/productos', productosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes);
 
// ==========================================
// MANEJO DE ERRORES
// ==========================================
 
// Ruta no encontrada - debe ir al final después de todas las otras rutas
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});
 
// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error del servidor:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});
 
// ==========================================
// INICIAR SERVIDOR
// ==========================================
 
app.listen(PORT, () => {
  console.log('==========================================');
  console.log('🚀 SERVIDOR BAZAR INICIADO');
  console.log('==========================================');
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log('==========================================');
});
 
export default app;
 
 