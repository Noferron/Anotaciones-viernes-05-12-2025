URL_API = "http://localhost:3000/api";

// Estados 
// Registro usuarios
let estado = {
    usuario: null,          // 👤 Información del usuario conectado (null = nadie conectado)
    token: null,           // 🔑 Clave secreta para comunicarse con el servidor
    productos: [],
    carrito: [],
};


// 🔧 FUNCIONES AUXILIARES PARA COMUNICACIÓN CON BACKEND

function getAuthHeaders() {
  // Cabeceras base que siempre necesitamos para enviar JSON
  const headers = {
    'Content-Type': 'application/json'
  };
  
  // Si el usuario está autenticado, agregar token JWT
  if (estado.token) {
    // Formato estándar: "Bearer <token>"
    // Este es el formato que espera nuestro auth.middleware.js
    headers.Authorization = `Bearer ${estado.token}`;
  }
  
  return headers;
}
//Si tiene el token y el usuario cambia el conjunto a booleano y este a TRUE con la doble negación
function estaLogueado() {
  // Usamos !! para convertir a boolean explícitamente
  // null && null = null → !!null = false
  // objeto && string = string → !!string = true
  return !!(estado.usuario && estado.token);
}

//Agregar al carrito 

function agregarAlCarrito(productoId, cantidad = 1) {
  // ============================================
  // 🔒 CAPA 1: VERIFICACIÓN DE AUTENTICACIÓN
  // ============================================
  
  /**
   * EXPLICACIÓN: ¿Por qué verificar autenticación aquí?
   * 
   * En una tienda real, solo los usuarios registrados pueden comprar.
   * Esto previene:
   * - Pedidos anónimos sin datos de contacto
   * - Problemas con el seguimiento de pedidos
   * - Carritos "fantasma" que no se pueden procesar
   * 
   * RELACIÓN CON BACKEND:
   * El backend también valida esto en auth.middleware.js cuando
   * se intenta crear un pedido. Esta es "validación por capas".
   */
  if (!estaLogueado()) {
    alert('⚠️ Debes iniciar sesión para agregar productos al carrito');
    return; // Termina la función inmediatamente (early return)
  }
  
  // ============================================
  // 🔍 CAPA 2: VERIFICACIÓN DE DATOS
  // ============================================
  
  /**
   * EXPLICACIÓN: Búsqueda del producto en el catálogo local
   * 
   * ¿Por qué buscar en estado.productos y no hacer fetch?
   * - Los productos ya están cargados en memoria (más rápido)
   * - Evitamos peticiones innecesarias al servidor
   * - Garantizamos que trabajamos con datos consistentes
   * 
   * MÉTODO find():
   * Devuelve el PRIMER elemento que cumple la condición
   * undefined si no encuentra nada
   */
  const producto = estado.productos.find(p => p.id === productoId);
  if (!producto) {
    alert('❌ Producto no encontrado');
    return;
  }
  
  // ============================================
  // ✅ CAPA 3: VERIFICACIÓN DE STOCK
  // ============================================
  
  /**
   * EXPLICACIÓN: Validación de stock disponible
   * 
   * ¿Por qué validar stock en frontend?
   * - Feedback inmediato al usuario (mejor UX)
   * - Evitamos peticiones destinadas a fallar
   * - Reducimos carga del servidor
   * 
   * NOTA IMPORTANTE:
   * Esta validación también se hace en backend porque el stock
   * puede cambiar entre que el usuario ve el producto y lo compra.
   */
  if (producto.stock < cantidad) {
    alert(`❌ Solo hay ${producto.stock} unidades disponibles`);
    return;
  }
  
  // ============================================
  // 🔍 CAPA 4: VERIFICACIÓN DE DUPLICADOS
  // ============================================
  
  /**
   * EXPLICACIÓN: ¿El producto ya está en el carrito?
   * 
   * Dos comportamientos posibles:
   * 1. SUMAR cantidades (más común en e-commerce)
   * 2. Reemplazar cantidad (menos común)
   * 
   * Elegimos SUMAR porque es más intuitivo para el usuario.
   * 
   * MÉTODO findIndex():
   * Devuelve la POSICIÓN del elemento encontrado
   * -1 si no encuentra nada
   */
  const productoEnCarrito = estado.carrito.find(item => item.id === productoId);
  
  if (productoEnCarrito) {
    // ========================================
    // 📈 ESCENARIO: PRODUCTO YA EN CARRITO
    // ========================================
    
    /**
     * Calcular nueva cantidad total y verificar que no exceda stock
     */
    const nuevaCantidad = productoEnCarrito.cantidad + cantidad;
    
    if (nuevaCantidad > producto.stock) {
      alert(`❌ No hay suficiente stock. Máximo: ${producto.stock}`);
      return;
    }
    
    // Actualizar cantidad directamente (modifica el objeto existente)
    productoEnCarrito.cantidad = nuevaCantidad;
    console.log(`📦 Cantidad actualizada: ${producto.nombre} x${nuevaCantidad}`);
    
  } else {
    // ========================================
    // ➕ ESCENARIO: PRODUCTO NUEVO EN CARRITO
    // ========================================
    
    /**
     * EXPLICACIÓN: Estructura del objeto carrito
     * 
     * Copiamos datos esenciales del producto pero agregamos:
     * - cantidad: Cuántas unidades quiere el usuario
     * - stock: Para validaciones futuras sin consultar catálogo
     * 
     * PATRÓN: No guardamos referencia al objeto original,
     * creamos un nuevo objeto con solo los datos que necesitamos.
     */
    estado.carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad,
      stock: producto.stock
    });
    console.log(`➕ Producto agregado al carrito: ${producto.nombre} x${cantidad}`);
  }
 // ============================================
  // 🎨 CAPA 5: ACTUALIZACIÓN DE INTERFAZ
  // ============================================
  
  /**
   * EXPLICACIÓN: Patrón de actualización reactiva
   * 
   * Cuando el estado cambia → la interfaz debe reflejarlo
   * Es el principio básico de frameworks como React/Vue
   * 
   * mostrarCarrito(): Regenera el HTML del carrito
   * actualizarBotonCarrito(): Actualiza contador en navegación
   */
  mostrarCarrito();
  actualizarBotonCarrito();
}

function quitarDelCarrito(productoId) {
  // Buscar posición del producto en el carrito
  const index = estado.carrito.findIndex(item => item.id === productoId);
  
  if (index !== -1) {
    // Guardar referencia para logging antes de eliminar
    const producto = estado.carrito[index];
    console.log(`🗑️ Producto quitado del carrito: ${producto.nombre}`);
    
    // splice(posición, cantidad) elimina elementos del array
    estado.carrito.splice(index, 1);
    
    // Actualizar interfaz para mostrar cambios
    mostrarCarrito();
    actualizarBotonCarrito();
  }
}
  
function cambiarCantidad(productoId, nuevaCantidad) {
  // Si cantidad es menor a 1, eliminar producto completamente
  if (nuevaCantidad < 1) {
    quitarDelCarrito(productoId);
    return;
  }
  
  // Buscar producto en carrito
  const productoEnCarrito = estado.carrito.find(item => item.id === productoId);
  if (productoEnCarrito) {
    // Verificar que no exceda stock disponible
    if (nuevaCantidad > productoEnCarrito.stock) {
      alert(`❌ Stock máximo: ${productoEnCarrito.stock}`);
      return;
    }
    
    // Actualizar cantidad y refrescar interfaz
    productoEnCarrito.cantidad = nuevaCantidad;
    mostrarCarrito();
    actualizarBotonCarrito();
  }
}


function calcularTotal() {
  return estado.carrito.reduce((total, item) => {
    return total + (item.precio * item.cantidad);
  }, 0); // 0 es el valor inicial del acumulador
}


async function verJSON() {
    try{
        const respuesta = await fetch (`${URL_API}/productos`);
        const datos = await respuesta.json();
        const salida = document.getElementById("listaProductos");
        salida.textContent = JSON.stringify(datos, null, 2);
    }catch (error){
        console.error("Error al obtener JSON:", error);
    }
    
}

document.addEventListener("DOMContentLoaded", () =>{
    document.getElementById("verJSON").addEventListener("click",verJSON);
    cargarProductos();
})

async function cargarProductos() {
    try{
        //Traemos los datos del back
        const respuesta = await fetch (`${URL_API}/productos`);
        //Convertimos la respuesta a JSON
        const datos = await respuesta.json();
        //Verificamos si fue exitosa la petición
        if(respuesta.ok){
          estado.productos = datos.data || datos;
            mostrarProductos(datos.data);
        }
        else{
            console.error ("Error al cargar productos");
        }
    } catch (error){
        console.error("Error de conexión:",error);
    }
}

// Función para mostrar los productos 

function mostrarProductos(lista){
    const contenedor = document.getElementById("productos");
    
    // Creamos el HTML para cada producto
    contenedor.innerHTML = lista.map(producto=> `
        <div class="product-card">
            <img src="images/foto.png" class="product-image" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p><strong>${producto.precio}€</strong></p>
            <p>Stock: ${producto.stock}</p>
            
        </div>
        `).join ('');
    
}


//--------------------------- Login y tokens---------------------------------------------------------------------

// Registro usuarios

// 💾 Guardar sesión en memoria + localStorage
function guardarSesion(token, usuario) {
  estado.token = token;
  estado.usuario = usuario;

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(usuario));

  console.log('💾 Sesión guardada para:', usuario.nombre);
}

// 🚪 Cerrar sesión
function cerrarSesion() {
  estado.token = null;
  estado.usuario = null;

  localStorage.removeItem('token');
  localStorage.removeItem('user');

  console.log('👋 Sesión cerrada');
  mostrarInterfaz();
}

// ⏪ Cargar sesión si ya estaba guardada en el navegador
function cargarSesionGuardada() {
  const tokenGuardado = localStorage.getItem('token');
  const usuarioGuardado = localStorage.getItem('user');

  if (tokenGuardado && usuarioGuardado) {
    try {
      estado.token = tokenGuardado;
      estado.usuario = JSON.parse(usuarioGuardado);
      console.log('👤 Sesión restaurada:', estado.usuario.nombre);
    } catch (err) {
      console.error('❌ Sesión corrupta, limpiando...', err);
      cerrarSesion();
    }
  }
}

// 🔑 LOGIN (email + password → token + usuario)
async function iniciarSesion(email, password) {
  try {
    const respuesta = await fetch(`${URL_API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const datos = await respuesta.json();
    console.log('📥 Respuesta login:', respuesta.status, datos);

    if (respuesta.ok) {
      guardarSesion(datos.token, datos.usuario);
      mostrarInterfaz();
      alert(`Bienvenido, ${datos.usuario.nombre}`);
    } else {
      alert(datos.message || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error('❌ Error login:', error);
    alert('No se pudo conectar con el servidor');
  }
}

// 📝 REGISTRO (nombre + email + password → crea usuario y lo loguea)
async function registrarUsuario(nombre, email, password) {
  try {
    const respuesta = await fetch(`${URL_API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });

    const datos = await respuesta.json();
    console.log('📥 Respuesta registro:', respuesta.status, datos);

    if (respuesta.ok) {
      guardarSesion(datos.token, datos.usuario);
      mostrarInterfaz();
      alert(`Cuenta creada. Bienvenido, ${datos.usuario.nombre}`);
    } else {
      alert(datos.message || 'Error al registrarse');
    }
  } catch (error) {
    console.error('❌ Error registro:', error);
    alert('No se pudo conectar con el servidor');
  }
}
// Mostrar u ocultar secciones según si hay usuario o no
function mostrarInterfaz() {
  const authSection = document.getElementById('authSection');
  const authNav     = document.getElementById('authNav'); // si lo tienes

  const logged = !!estado.usuario;

  // Formulario login/registro
  if (authSection) {
    if (logged) {
      authSection.classList.add('hidden');
    } else {
      authSection.classList.remove('hidden');
    }
  }

  // Zona de navegación (opcional)
  if (authNav) {
    if (logged) {
      authNav.innerHTML = `
        <span class="user-name">👤 ${estado.usuario.nombre}</span>
        <button id="logoutButton" class="btn btn-outline">Cerrar sesión</button>
      `;
      document.getElementById('logoutButton')
        .addEventListener('click', cerrarSesion);
    } else {
      authNav.innerHTML = `<span>Inicia sesión para comprar</span>`;
    }
  }
}

// Conectar los formularios con las funciones de arriba
function configurarEventosLogin() {
  const loginForm    = document.getElementById('loginFormElement');
  const registerForm = document.getElementById('registerFormElement');
  const showRegister = document.getElementById('showRegister');
  const showLogin    = document.getElementById('showLogin');

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      await iniciarSesion(email, password);
      loginForm.reset();
    });
  }

  // REGISTRO
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre   = document.getElementById('registerNombre').value;
      const email    = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      await registrarUsuario(nombre, email, password);
      registerForm.reset();
    });
  }

  // Cambiar de login → registro
  if (showRegister) {
    showRegister.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loginForm').classList.add('hidden');
      document.getElementById('registerForm').classList.remove('hidden');
    });
  }

  // Cambiar de registro → login
  if (showLogin) {
    showLogin.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('registerForm').classList.add('hidden');
      document.getElementById('loginForm').classList.remove('hidden');
    });
  }
}



// Arranque básico
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 App de login/registro lista');
  cargarSesionGuardada();   // opcional, pero bonito para recordar al usuario
  configurarEventosLogin();
  mostrarInterfaz();
});