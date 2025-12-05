import pool from "../config/db.js";

export async function crearPedido(clienteId) {
  // Ejecutar INSERT en la tabla pedidos
  // MySQL asignará automáticamente el ID y la fecha actual
  const [result] = await pool.query(
    "INSERT INTO pedidos (cliente_id) VALUES (?)",
    [clienteId]
  );

  // Devolver la información del pedido creado
  return {
    id: result.insertId,      // ID generado automáticamente por MySQL
    cliente_id: clienteId,    // ID del cliente que creó el pedido
    estado: "pendiente",      // Estado por defecto
  };
}

export async function agregarProductoAPedido({ pedidoId, productoId, cantidad }) {
  // Insertar línea de pedido en la tabla pedidos_productos
  const [result] = await pool.query(
    "INSERT INTO pedidos_productos (pedido_id, producto_id, cantidad) VALUES (?, ?, ?)",
    [pedidoId, productoId, cantidad]
  );

  // Devolver información de la línea de pedido creada
  return {
    id: result.insertId,     // ID de la línea de pedido
    pedido_id: pedidoId,     // ID del pedido padre
    producto_id: productoId, // ID del producto agregado
    cantidad,                // Cantidad del producto
  };
}

export async function obtenerPedidoPorId(id) {
  const [rows] = await pool.query(
    `SELECT p.id, p.cliente_id, p.estado, p.fecha
     FROM pedidos p
     WHERE p.id = ?`,
    [id]
  );
  
  // Devolver el primer resultado (o undefined si no hay resultados)
  return rows[0];
}

export async function obtenerLineasDePedido(idPedido) {
  const [rows] = await pool.query(
    `SELECT 
        pp.id,
        pp.cantidad,
        pr.id AS producto_id,
        pr.nombre AS producto_nombre,
        pr.precio AS producto_precio,
        pr.imagen_url AS producto_imagen
      FROM pedidos_productos pp
      JOIN productos pr ON pp.producto_id = pr.id
      WHERE pp.pedido_id = ?`,
    [idPedido]
  );
  
  return rows;
}

export async function obtenerPedidosDeCliente(clienteId) {
  const [rows] = await pool.query(
    `SELECT id, cliente_id, estado, fecha
     FROM pedidos
     WHERE cliente_id = ?
     ORDER BY fecha DESC`,
    [clienteId]
  );
  
  return rows;
}

export async function actualizarEstado(idPedido, nuevoEstado) {
  // Actualizar el estado en la base de datos
  await pool.query(
    "UPDATE pedidos SET estado = ? WHERE id = ?",
    [nuevoEstado, idPedido]
  );

  // Devolver confirmación del cambio
  return { 
    id: idPedido, 
    estado: nuevoEstado 
  };
}

export async function crear({ cliente_id, productos = [] }) {
  try {
    // Paso 1: Crear la cabecera del pedido
    const pedido = await crearPedido(cliente_id);
    
    // Paso 2: Agregar productos al pedido (si hay productos)
    const productosAgregados = [];
    
    for (const producto of productos) {
      const lineaPedido = await agregarProductoAPedido({
        pedidoId: pedido.id,
        productoId: producto.producto_id,
        cantidad: producto.cantidad
      });
      productosAgregados.push(lineaPedido);
    }
    
    // Paso 3: Devolver el pedido completo
    return {
      id: pedido.id,
      cliente_id: pedido.cliente_id,
      estado: pedido.estado,
      productos: productosAgregados,
      total_productos: productosAgregados.length
    };
    
  } catch (error) {
    console.error('Error al crear pedido completo:', error);
    throw error;
  }
}

/**
 * Alias para compatibilidad con el controlador
 */
export const obtenerPorCliente = obtenerPedidosDeCliente;