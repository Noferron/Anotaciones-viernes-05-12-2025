Perfecto.
Aquí tienes **TU README.md COMPLETO**, limpio, ordenado y con formato profesional.
Puedes copiarlo directamente en tu proyecto como:

📄 **`README.md`**

---

# 🛠️ Proyecto Fullstack: Node.js + Express + MySQL + Frontend + Login

Este proyecto implementa un backend con **Node.js**, **Express** y **MySQL**, junto a un frontend simple en HTML/JS que se conecta a la API.
Incluye autenticación con **bcryptjs** y **jsonwebtoken**, carga de productos desde base de datos, y estructura MVC.

---

## 📑 Índice

1. [Estructura del proyecto](#-estructura-del-proyecto)
2. [Instalación](#-instalación)
3. [Configuración del entorno](#️-configuración-del-entorno-env)
4. [Base de datos](#-base-de-datos-initdbjs)
5. [Servidor](#-servidor-serverjs)
6. [Modelos](#-modelos)
7. [Controladores](#-controladores)
8. [Rutas](#-rutas)
9. [Frontend](#-frontend)
10. [Autenticación](#-autenticación)
11. [Pruebas con ThunderClient](#-pruebas-en-thunderclient)

---

# 📁 Estructura del proyecto

```
backend/
│── config/
│   └── db.js
│── controllers/
│   ├── productos.controller.js
│   └── auth.controller.js
│── models/
│   ├── productos.model.js
│   └── clientes.model.js
│── routes/
│   ├── productos.routes.js
│   └── auth.routes.js
│── init.db.js
│── server.js
│── .env
│── .gitignore
frontend/
│── index.html
│── styles.css
│── script.js
README.md
```

---

# 🚀 Instalación

## 1. Crear carpetas

```bash
mkdir backend
cd backend
mkdir config routes controllers models
```

## 2. Instalar dependencias

```bash
npm init -y
npm install express cors dotenv mysql2
npm install --save-dev nodemon
```

---

# ⚙️ Configuración del entorno (.env)

Crear archivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tienda
DB_PORT=3306

PORT=3000

JWT_SECRET=miclaveultrasecreta
JWT_EXPIRES=1d
```

---

# 🗄 Configuración de base de datos (`db.js`)

```js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;
```

---

# 📘 Archivo `.gitignore`

```
node_modules/
.env
```

---

# 🚀 Servidor (`server.js`)

```js
import "dotenv/config";
import express from "express";
import cors from "cors";

import productosRoutes from "./routes/productos.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
  res.send("API Node + MySQL - Proyecto");
});

// Rutas
app.use("/api/productos", productosRoutes);
app.use("/api/auth", authRoutes);

// Arrancar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
);
```

---

# 🏗 Base de datos (`init.db.js`)

```js
import pool from "./config/db.js";

async function crearBBDD() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Tablas creadas correctamente");
}

crearBBDD();
```

Ejecutar:

```bash
node init.db.js
```

---

# 📦 Modelos

## **Productos (`productos.model.js`)**

```js
import pool from "../config/db.js";

export async function obtenerProductos() {
  const [rows] = await pool.query("SELECT * FROM productos");
  return rows;
}
```

## **Clientes (`clientes.model.js`)**

```js
import pool from "../config/db.js";

export async function buscarPorEmail(email) {
  const [rows] = await pool.query(
    "SELECT id, nombre, email, password FROM clientes WHERE email = ?",
    [email]
  );
  return rows[0];
}

export async function crearCliente({ nombre, email, password }) {
  const [result] = await pool.query(
    "INSERT INTO clientes (nombre, email, password) VALUES (?, ?, ?)",
    [nombre, email, password]
  );

  return { id: result.insertId, nombre, email };
}
```

---

# 🎮 Controladores

## **Productos (`productos.controller.js`)**

```js
import * as productosModel from "../models/productos.model.js";

export async function getProductos(req, res) {
  try {
    const productos = await productosModel.obtenerProductos();
    res.json({
      success: true,
      total: productos.length,
      data: productos
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos" });
  }
}
```

## **Autenticación (`auth.controller.js`)**

```js
import * as clientesModel from "../models/clientes.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTRO
export async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;

    const existe = await clientesModel.buscarPorEmail(email);
    if (existe)
      return res.status(400).json({ message: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await clientesModel.crearCliente({
      nombre,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { cliente_id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      success: true,
      message: "Usuario registrado exitosamente",
      token,
      usuario
    });

  } catch (error) {
    res.status(500).json({ error: "Error en el registro" });
  }
}

// LOGIN
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const usuario = await clientesModel.buscarPorEmail(email);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    const esCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esCorrecta)
      return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { cliente_id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
}
```

---

# 🛣 Rutas

## **Productos (`productos.routes.js`)**

```js
import { Router } from "express";
import * as productosController from "../controllers/productos.controller.js";

const router = Router();

router.get("/", productosController.getProductos);

export default router;
```

## **Auth (`auth.routes.js`)**

```js
import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
```

---

# 🌐 Frontend

## Ejemplo simple para ver productos

```html
<button id="btnVerJSON">Ver productos (JSON)</button>
<pre id="listaProductos"></pre>

<div id="productos"></div>
```

### `script.js`

```js
const API_URL = "http://localhost:3000/api/productos";

async function verJSON() {
  const res = await fetch(API_URL);
  const datos = await res.json();
  document.getElementById("listaProductos").textContent =
    JSON.stringify(datos, null, 2);
}

async function cargarProductos() {
  const res = await fetch(API_URL);
  const { data } = await res.json();
  mostrarProductos(data);
}

function mostrarProductos(lista) {
  const cont = document.getElementById("productos");

  cont.innerHTML = lista
    .map(p => `
      <div class="tarjeta">
        <h3>${p.nombre}</h3>
        <p>Precio: ${p.precio}€</p>
      </div>
    `)
    .join("");
}

document.addEventListener("DOMContentLoaded", cargarProductos);
```

---

# 🔐 Autenticación (Frontend)

Formulario:

```html
<form id="formLogin">
  <input type="email" id="email" required>
  <input type="password" id="password" required>
  <button type="submit">Iniciar sesión</button>
</form>
```

---

# 🧪 Pruebas en ThunderClient

### **Registro**

```
POST http://localhost:3000/api/auth/register
{
  "nombre": "Roberto",
  "email": "roberto@ejemplo.com",
  "password": "123456"
}
```

### **Login**

```
POST http://localhost:3000/api/auth/login
{
  "email": "roberto@ejemplo.com",
  "password": "123456"
}
```


