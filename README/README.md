# INDICE

1. **[1.- Creamos las capertas](#1-creamos-las-capertas)**
2. **[2.- Creamos los paquetes y depedencias](#2-creamos-los-paquetes-y-depedencias)**
3. **[3.- Modificamos packagejson](#3-modificamos-packagejson)**
4. **[4.- Creamos nuestro archivo env](#4-creamos-nuestro-archivo-env)**
5. **[5.- Creamos la configuración dentro de dbjs](#5-creamos-la-configuración-dentro-de-dbjs)**
6. **[6.- Creamos el archivo gitignore](#6-creamos-el-archivo-gitignore)**
7. **[7.- Creamos serverjs](#7-creamos-serverjs)**
8. **[8.- Creamos la primera ruta y el archivo de rutas productosroutesjs](#8-creamos-la-primera-ruta-y-el-archivo-de-rutas-productosroutesjs)**
9. **[9.- Importamos productosroutes y lo llamamos en el servidor](#9-importamos-productosroutes-y-lo-llamamos-en-el-servidor)**
10. **[10.- Con pool comprobamos conexión](#10-con-pool-comprobamos-conexión)**
11. **[11.- Creamos el archivo initdbjs](#11-creamos-el-archivo-initdbjs)**
12. **[12.- Creamos la carpeta controlador y controlador](#12-creamos-la-carpeta-controlador-y-controlador)**
13. **[13.- productosmodel](#13-productosmodel)**
14. **[14.- productoscontroller](#14-productoscontroller)**
15. **[15.- productosroutes](#15-productosroutes)**
16. **[16.- Creamos el frontend](#16-creamos-el-frontend)**
17. **[17.- Creamos el script del frontend y conectamos con el backend](#17-creamos-el-script-del-frontend-y-conectamos-con-el-backend)**
18. **[18.- Damos estilo a nuestros productos](#18-damos-estilo-a-nuestros-productos)**
19. **[19.- Login](#19-login)**
20. **[20.- clientesmodels](#20-clientesmodels)**
21. **[21.- authcontrollerjs](#21-authcontrollerjs)**
22. **[22.- Creamos authroutesjs](#22-creamos-authroutesjs)**
23. **[23.- Configuramos en el servidor la ruta para auth](#23-configuramos-en-el-servidor-la-ruta-para-auth)**
24. **[24.- Probamos las rutas por thunder](#24-probamos-las-rutas-por-thunder)**
25. **[25.- Creamos el formulario de registro y de inicio de sesión en frontend](#25-creamos-el-formulario-de-registro-y-de-inicio-de-sesión-en-frontend)**



# 1.- Creamos las capertas: 
   * -  mkdir backend y dentro las capertas de config y routes

# 2.- Creamos los paquetes y depedencias
   - npm init -y --> Crea el package.json
   * - npm install express cors dotenv mysql2 --> instalamos express, cors, los archivo .env y las dependencias con mysql
   * - npm install --save-dev nodemon --> Realizar la autorecarga del proyecto por cada guardado

# 3.- Modificamos package.json 
   * - "type": "module" --> para poder usar modulos importandolos y exportandolos
   * - Dentro de "scripts"{} añadimos "start": "node server.js",
    "dev": "nodemon server.js" --> son 2 formas de inicar el servidor. "start" para iniciar el proyecto y "dev" para el desarrollo para que se refresque automaticamente cada vez que guardemos. 

# 4.- Creamos nuestro archivo .env
 *  Aquí es donde se guardan las claves y conexiones con la base de datos.
    La llenamos con lo siguiente: 

    DB_HOST=localhost --> indicamos que trabajamos en local, es una URL o IP
    DB_USER=root --> Usuario de apache. Se puede comprobar en config de apache
    DB_PASSWORD= --> Contraseña de la base de datos
    DB_NAME=tienda --> Nombre de la base de datos
    DB_PORT=3306 --> Puerto que usa XAMPP

    PORT=3000 --> Puerto que queremos usar

# 5.- Creamos la configuración dentro de db.js
   * Traemos todos los datos que introdujimos en el archivo.env, creamos un objeto llamado "pool" para poder exportarlo y usarlo fuera de db.js. Además importamos la libreria mysql de "mysql2/promise"

    ``` js 
    const pool = mysql.createPool({ -->Creamos el objeto
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,  
    connectionLimit: 10,
    queueLimit: 0
    });

    export default pool; 
    ```

# 6.- Creamos el archivo .gitignore 
  * Aquí indicamos a git que archivos no queremos que suban al repositorio de GitHub.

    .env
    guia.pdf
    node_modules

# 7.- Creamos server.js

   * importamos "dotenv/config", express, cors, pool y rutas

   * - Llamamos a express y para ello la metemos en una variable llamada app para poder usar sus componentes (use, get, post, listen, etc)

   * - Creamos las middlwares 
        app.use(cors()) y app.use(express.json())
    
   * - Creamos ruta raíz, que podemos usar para comprobar que el servidor funciona correctamente. 
        ```js 
        app.get("/", (req,res)=> {
           res.send('API Node + MySQL - Bloque 3');
        }); 
        ``` 
   * - Arrancamos el servidor 

        ```js 
        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
      ```

# 8.- Creamos la primera ruta y el archivo de rutas "productos.routes.js

   * Importamos Router desde express para poder usar las rutas y usar los métodos de router, que en este caso estamos probando el GET --> productosRoutes.get
    Indicamos las ruta "/" y el requerimiento o peticion y la respuesta desde el front hacia el front.

    Definimos la respuesta "res.json" donde devolveremos un mensaje, en este caso de prueba. 

    Por último exportamos para poder usarlo en server.js

# 9.- Importamos productosRoutes y lo llamamos y generamos una ruta dentro del servidor. 

  *  - Importamos el objeto productosRoutes desde su archivo.

   * - Indicamos que ruta usar y que objeto usa esa ruta --> app.use("/api/productos", productosRoutes);

  *  - Si inicamos el servidor y buscamos la ruta nos devolverá el mensaje que le dimos para mostrarnos al usar esa ruta puesto que la petición que le damos es GET

# 10.- Con "pool" podemos realiza una petición GET al servidor para comprobar que todo está funcionando de forma correcta. 
    
  * Dentro del archivo server tenermos la petición de prueba-bbdd y ahí podemos comprobar que está leyendo correctamente todos los datos del pool y que permite la conexión a la BBDD. 

# 11.- Creamos el archivo init.db.js. 
    
   * Aquí introducimos los datos a la base de datos sin tener que hacerlo desde la consola de XAMPP. 

    Antes de esto, en db.js ponemos lo siguiente --> import dotenv from "dotenv";
    
    dotenv.config();
    
    Estas líneas sirven para recargar los datos de la base de datos y que no den errores por problemas con la conexión, usuario, contraseña, etc.

#   - Creamos la funcion "sync function crearBBDD()"
   * dentro de esta función en el archivo init.db.js realizamos la creación de tablas y columnas para nuestra BBDD. 

    ```js  // TABLA CLIENTES
        await pool.query(`
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
       ```

    await --> es para que la función sea asincrona 
    CREATE TABLE IF NOT EXISTS --> Aquí decimos que cree la tabla si no existe, para que no borre si existe ya una igual. 

    IMPORTANTE --> node init.db.js dentro del terminal integrado del archivo para crear la base de datos 

# 12.- Creamos la carpeta controlador y controlador dentro de backend 

  *  Dentro creamos los archivos productos.controller.js y productos.model.js. 

# 13.- productos.model 

  *   Importamos "pool" para conectar con la BBDD. 
  *   Creamos la función asincrona obtenerTodos. Desde aquí realizamos la consulta a la BBDD de MySQL y le pedimos que cree un array de filas (rows) para mostrarlos.
    ![alt text](image.png) 

# 14.- productos.controller

  *   Importamos todas la funciones de productos.model.js con * y lo renombramos como productosModel creando así un objeto con todas la funciones del archivo. De esta manera importamos todas las funciones a la vez y no tenemos que ir una a una.

  *   Creamos la función getProductos. Aquí llamamos la función obtenerProductos de productosModel -->  const productos = productosModel.obternerProductos 

  *   Realiza la petición al servidor y ejecuta la consulta de la funcion obtenerProductos tantas veces como larga sea la tabla --> productos.length 
    y nos guardará los datos obtenidos en data --> data: productos
    ![alt text](image-1.png)
# 15. productos.routes 

  *   Importamos todas las funciones del archivo productos.controller.js usanao el selector universal (*) y lo renombramos como productosController para poder usar las funciones como métodos. 

  *   Creamos la ruta para la petición GET al servidor --> router.get ("/",productosController.getProductos)

  *   productosController.getProductos. Aquí tenemos el objeto creado en la importación y con el (.) llamamos la función que tenemos creada "getProductos". 
    ![alt text](image-2.png)
# 16.- Creamos el frontend
  *   Creamos los archivos index.html, styles.css y script.js

  *   Creamos un html donde tenga un botón para obtener los datos del JSON bruto y nos muestre el listado de productos de las BBDD. Y con la etiqueta <pre> mostramos los datos,
    puesto que se trata de una etiqueta para mostrar código. 
    ![alt text](image-3.png)

  *   Luego, creamos el script: 

# 17.- Creamos el script del frontend y conectamos con el backend

  *  Para traer los datos del backend debemos usar el método "fetch" y desde aquí indicarle la URL donde buscar los datos. Pero antes de todo esto: 
      * 1. Creamos la variable global URL_API o API_URL donde indicamos la dirección del backend "http://localhost.3000".
        2. Creamos una función asincrona verJSON () 
        3. Usamos try...catch. 
         Dentro de try: 
            - Declaramos la variable "respuesta" donde, con fetch, indicaremos la URL donde obtener los datos del backend. 
            ![alt text](image-4.png)
            - Declaramos la variable datos donde escribimos la variable "respuesta" y usamos el método ".json()"
            ![alt text](image-5.png)
            - Luego creamos una variable para indicar que ID de html queremos traer para usarlo y poder imprimir los datos en ese campo. 
            ![alt text](image-6.png)
            - Por último, usamos la variable "salida" y usamos el método "textContent" que será igual a "JSON.stringify (datos)" aquí ya traemos e imprimimos dentro del ID "listaProductos" todos los datos obtenidos del JSON traido desde backend. Además añadimos dentro de "JSON.stringify(datos)" "null,2" con esto conseguimos que los datos estén espaciados y con un formato definido. 
             ![alt text](image-7.png)
        4. Dentro de catch: 
            - Indicamos un mensaje de error "Error al obtener JSON:" y seguido del metodo error, que nos traerá desde consola el error obtenido al ejecutar el codigo. 
        
        5. Por último. Generamos un evento donde primero se cargue el DOM y dentro introducimos el evento del botón. De esta forma consiguimos que los datos de la BBDD se cargue antes de la carga del botón. Con esto conseguimos que no se ejecute la acción del botón antes de obtener los datos del servidor, porque o nos mostrará el campo vacío o con algunos de los datos y no todos. 
        ![alt text](image-8.png)

# 18.- Damos estilo a nuestros productos
    
  *  Ahora vamos crear unas tarjetas para que cuando realicemos la petición se generen con los datos de los productos y cree un campo para cada dato, quitando así el estilo JSON. Para ellos primero realizamos la función de petición al back solicitando lo datos. Cómo hacemos esto? 

      * 1.- Creamos la función cargarProductos. Aquí traeremos desde la URL indicada los datos y estos los convertiremos a JSON para que el navegador pueda leerlo.
        ![alt text](image-9.png)
        2.- Comprobamos si la petición se realizó con exito. Para ello escribimos un condicional donde preguntaremos si "respuesta.ok". "ok" nos devuelve un booleano (TRUE o FALSE), si es TRUE, entonces se cumple la primera condición y si el FALSE nos vamos a ELSE. 
        ![alt text](image-10.png)
        3.- Terminamos la función con el catch para capturar posibles errores. Para ellos lo realizamos igual que el anterior.
        ![alt text](image-11.png)
    
  * Ya tenemos la petición a back. Desde esta petición traemos los datos a la función mostrarProductos que vamos a crear ahora. Los datos los trae de la siguiente forma: 
        - ![alt text](image-12.png) datos es una variable que creamos en nuestro script de front y data es una variable que viene de productos.controller que nos trae los datos de la tabla productos.

   * Sabiendo esto. Creamos la función mostrarProductos(): 

      * 1.- Indicamos dentro de los parentesis el parámetro lista, que usaremos después para mapear todo el listado de productos que traemos desde la BBDD.
        ![alt text](image-13.png) 

        2.- Creamos una varible para el contenedor y la conectamos con el HTML a través de una ID, que en nuestro caso es "productos". 
        3.- Usamos la variable contenedor y el método "innerHTML" para crear las tarjetas. Para ello usamos el parámetro "lista", este parámetro es una array que se creará con los datos de productos. Seguimos con el método "map" con el que recorrerá cada elemento del array y nos devuelve un nuevo array.
        ![alt text](image-14.png)
        4.- Creamos el HTML que queremos que se muestre en el navegador. 
        ![alt text](image-15.png)
        5.- El método ".join("")" sirve para que al crear cada tarjeta no se separece por comas, que es como se mostrarían los datos obtenidos de un array, entonces con este método conseguimos cambiar la coma por la separación que nosotros indiquemos, que en este caso es un espacio vacío. 
    
   * Por último, y como hicimos en la anterior petición. Creamos un evento en el cúal de decimos que primero cargue el DOM y que luego se ejecute la funcion cargarProductos, para que de esta forma no aparezca vacío y tenga tiempo a obtener los datos de la BBDD. 
    ![alt text](image-16.png)
--------------------------------------------------------------------------------------------------------------------------------------------
# 19.- Login 

   * Vamos a crear el acceso a distintos clientes. Para ello necesitaremos un formulario de acceso y/o un formulario para que se registren. Los email, en la BBDD, la indicaremos como UNIQUE para que no pueda repetirse. 

# 20.- clientes.models  
*  Creamos el archivo donde generaremos las peticiones a la BBDD para crear o buscar clientes. 
     *   1.- Conectamos el archivo con las BBDD importando pool.
        ![alt text](image-17.png)
        
     *   2.- Creamos la función buscarPorEmail (para iniciar sesión). Para ello primero permitimos su exportación y nos aseguramos que sea asincrona. 
          *  1.- Creamos una variable que sea un array y lo llenamos con la petición a la BBDD. Para ellos usamos el objeto pool y le hacemos la petición. En este caso pedimos que nos devuelva la id, nombre, email, password, creado_en a la tabla clientes donde el email sea ?, es decir, que se lo daremos desde el frontend desde un formulario, por ejemplo. 
           * 2.- Pedimos que nos devuelva el array con las líneas necesarias para devolver los datos solicitados. 
            ![alt text](image-18.png)
   *     3.- Creamos la función para crear cliente nuevo. En la cual, el método que usaremos en SQL será el POST:
         *   1.- Creamos la función crearCliente() el cúal recibe un objeto con los datos --> nombre, email,password 
         ![alt text](image-24.png)
         *   2.- Creamos la variable resultado que será un array
         *   3.- La variable será igual a pool y el método query para realizar la inserción de datos en SQL, donde le decimos que los datos del formulario que haremos en el frontend. 
          *  4.- En el array introducimos los datos que queremos que se guarden y tienen que tener el mismo orden, puesto que cada uno tiene un tipo de datos. 
            ![alt text](image-23.png)
         *   5.- En el return, pedimos que nos devuelva un objeto que usaremos para crear el controlador = auth.controller.js

# 21.- auth.controller.js
*   Creamos este archivo. 

  *  1.- Nos importamos todas la funciones de clientes.model.js, por lo que usamos el selector universal (*) y le indicamos un nombre a todo este conjunto de funciones con "as" 
    ![alt text](image-19.png)
    2.- Instalamos las librerias para encriptar las contraseñas con npm install jsonwebtoken y con npm install bcryptjs.
    bcryptjs --> hash a las contraseñas (encripta)
    jwttoken --> para mantener las sesiones abiertas

    3.- Importamos las librerias de encriptación. 
    ![alt text](image-20.png)
    4.- Creamos la funcion de registro-->
      1.- Try...catch
    *   --> Traemos los datos del front introducidos por el usuario (nombre,  email, password)
    ![alt text](image-29.png)
    
      *  -->  Verificamos si el usuario existe antes de registralo y guardarlo en la base de datos. Esto lo hacemos usando la función buscarPorEmail del clientesModel trayendo el email introducido por el usuario en el front (dentro de parentesis)
        ![alt text](image-30.png)

        --> Si el usuario no existe, primero encriptamos la password antes de guardarla en la BBDD, por lo que usamos bcrypt con el método hash en la que traemos la contraseña introducida por el usuario e indicamos el numero de "vueltas" que hace la encriptación para generar la password encriptada.
        ![alt text](image-31.png)

        --> Una vez creada la encriptación, creamos el cliente en la BBDD.
        Para esto usamos la función crearCliente que traemos de clientesModel y le decimos que nombre, email que vienen de front lo lleva al modelo que espera tambien nombre e email. En cambio le decimos que la contraseña no coja la que traemos desde front porque viene en texto plano, sino le indicamos que use la variable hashedPassword que es la que encryptamos. 
        ![alt text](image-32.png)

        Ya con esto el modelo realiza el INSERT INTO y crea el cliente en la BBDD. 

        --> Por último creamos un token nuevo para el usuario igual que indicamos en el siguiente punto para que se inicie sesión una vez te registres. 


    5.- Creamos la función login () -->
    *  1.- Try..catch--> dentro de try:

        --> creamos la variable {email, password}, esto es como en el frontend indicamos el email y contraseña y cuando le damos a enviar y envía la petición de comprobación se usuario. Es decir, en el frontend introducimos los datos email y password y llega desde rutas al controlador y rellena esta variable con los datos introducidos, que luego viajan a modelo y, mediante SQL, comprueba si existe este usuario. 

        --> La constraseña que nos llega tenemos que encriptarla con bcript y verificar si es correcta, pero se realiza encriptando la contraseña introducida. 
        ![alt text](image-25.png)
        Aquí vemos como usamos bcrypt y el método "compare", dentro de parentesis ponemos qué queremos comparar --> password, que es la contraseña introducida en el front y luego usuario.password que viene de la BBDD para comparar. 
        ![alt text](image-26.png)

        --> Buscamos usuario: usamos clientesModel con el método, que es la función traida de su script, buscarPorEmail y dentro de parentesis el email que introdujo el usuario desde el front. 
        ![alt text](image-27.png)
        
        --> Una vez tenemos la contraseña verificada y el usuario correcto desde la BBDD, generamos el token para que pueda permanecer la sesión abierta el tiempo establecido que indicamos en el .env. 

        Para crear el token usamos jwt y el método "sing" y le indicamos el id del usuario. Traemos del .env la contraseña que pusimos para poder usar esta librería y treamos el tiempo de expiración indicada también en el .env. 
        ![alt text](image-28.png)



    6.- Introducimos estos datos en el archivo .env : ![alt text](image-21.png)
# 22. Creamos auth.routes.js

Importamos Router de express e importamos todas las funciones de auth.controller.js con el selectro universal y lo renombramos con "as" como authController.

Inicializamos router con la función Router()

Por último creamos las rutas con el método post.
![alt text](image-33.png) 

# 23.- Configuramos en el servidor la ruta para auth

*    1.- Importamos la ruta de auth.routes.js que lo importamos con el nombre que queramos, en este caso, authRoutes. Aquí no es necesario usar el selector universal ni importar una a una las funciones porque son tenemos rutas. 

    2.- Indicamos que ruta usar al server. Esto lo hacemos usando la función de express que inicializamos como app y usamos el método "use" y dentro de los parentesis indicamos la ruta y a authRoutes![alt text](image-22.png)

# 24.- Probamos las rutas por Thunder

Intentamos crear un usario desde la ruta definida en el server --> http://localhost:3000/api/auth/register
--> Con el método POST
--> En body llenamos los datos con formato JSON de la siguiente manera: 
  -->
  ```JSON
    {
      "nombre":"Roberto",
      "email": "roberto@ejemplo.com",
      "password":"123456"
     }
  ```
  

EXITO. Usuario creado! --> 
```JSON
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRlX2lkIjo0LCJpYXQiOjE3NjQ2NzU0NjQsImV4cCI6MTc2NDc2MTg2NH0.j3wTa3lFWCvFbRo75y6ejaPNH83nJudhGuziI-dODFc",
  "usuario": {
    "id": 4,
    "nombre": "Roberto",
    "email": "roberto@ejemplo.com"
  }
}
```

Ahora intentamos iniciar sesion 
--> http://localhost:3000/api/auth/login
--> Método POST
--> 
```JSON
{
  "email": "roberto@ejemplo.com",
  "password":"123456"
}
```
# 25.- Creamos el formulario de registro y de inicio de sesión en frontend

* En el HTML creamos una sección y creamos dentro el formulario.
    1.- Creamos el formulario de login
      --> Datos clave: Input type:"email" y type:"password", además de required en ambos para impedir que pulsen el botón de "Iniciar" sin rellenar los campos.
      --> Creamos el boton "Iniciar" type:"submit" para que envie los datos una vez lo indiquemos en el script con los eventos. 

# 26.- Creamos el script
  --> Creamos la variable estado. Aquí definimos un objeto que guarda los datos y mantiene la sesión del usuario abierta. 
  ![alt text](image-35.png)
  Esta variable no se usa en REACT, pero en HTML podemos crearla. 

  * 1.- Función guardarSesion() --> 
      --> usamos los objetos de estado y le decimos que token que viene de back y token del script de front es el mismo. Hacemos lo mismo con usuario. 
      ![alt text](image-36.png)
      token y usuario de los parametros son los que vienen de back. Usamos localStorage.setItem que localStorage es un objeto del DOM y setItem método de este objeto y el usuario que luego veremos en inspeccionar en el navegador/application/localstorage.
      ![alt text](image-37.png)
      ![alt text](image-38.png)

      Para que la funcion guardarSesion obtenga estos datos tenemos que traerlos del back que lo haremos con la función cargarSesionGuardada().

    2.- Función cerrarSesion() -->
      --> esta función es practicamente igual, pero sin los parámetros, puesto que no los necesitamos. Aquí vamos a volver a cambiar el valor de los estados "token" y "usuario" a NULL. Para ello usamos localStorage.removeItem, con este método podemos cambiar los valores a NULL de nuevo. 
  * .- Función registrar usuario: 
      --> tenemos en parámetros los datos que obtendremos del front (nombre,emai y password)
      --> Creamos las variable respuesta donde realizamos con fetch la petición, que en este caso no será de lectura (GET), sino de escritura (POST).

      En headers indicamos que los datos se enviarán en formato JSON

      En body, le decimos que le enviamos un objeto con esos 3 datos con formato JSON, ya que es lo que espera y puede leer el backend. 
      ![alt text](image-34.png)

      De esta forma estamos enviando los datos obtenidos del formulario desde el front al backend para que los guarde en la BBDD usando la función crear clientes, donde tiene la orden SQL, aunque antes de todo esto, y para ser exactos el flujo de datos sería el siguiente: 

      Front -> Script Front -> Server -> authRoutes -> authController -> clientesModel -> pool (db.js) -> .env

      -->El front envia los datos que los procesa con el script desde la función registrarUsario()

      --> Desde aquí viaja al server por la ruta "www.localhost:3000/api/auth/register"

      --> Donde está usando también la ruta de auth.routes.js; después los datos obtenidos del front pasan a la función register () y aquí procesa los datos y encripta la contraseña con bcript.hash

      --> Luego todos estos datos los envía a la función crearCliente() de clientes.model.js donde se encuentra con la orden SQL y con los datos de pool que sirven para conectarse a la BBDD y aquí ya se ejecuta la orden de guardado. 

      dentro de la funcion registrar usuario creamos un condicional donde si la respuesta de registro es ok, ejecutamos la función guardar sesion donde está el token, por lo que nada más regitrarse se iniciará la sesión.

    3.- Función cargarSesionGuardada()
      --> traemos los datos de localStorage con el método "getItem" y guardamos estos valores en variables para usarlas ahora. 
      ![alt text](image-39.png)
      --> Creamos un condicional donde comparamos si las variables "tokenGuardado" y "usuarioGuardado" son TRUE y si lo son usamos try...catch y guardamos estos datos en el estado y con esto ya tenemos la sesion iniciada. 

      Si los datos son FALSE llamamos a la función cerrarSesion() para limpiar el local y evitar errores.
    ![alt text](image-40.png)

    4.- 

    5.- Función iniciarSesion()
      --> En esta función tenemos los parámetros "email" y "password" que traemos desde front, esto lo usaremos para enviarselo a backend y que compruebe si los datos existen. Lo hacemos desde try...catch con fetch

      --> try: creamos la variable respuesta, traemos la confirmación o no de la comprobación que le dijimos que hiciera. Esta comprobación se la realizamos con el método POST en la URL definida en el servidor para esta tarea. Le enviamos en formato JSON los datos de front. 
      ![alt text](image-41.png)

        --> Recibimos la respuesta, pero no la entiende así el front, por lo que tenemos que traducirla, por lo que creamos la variable datos y la llenamos con await respuesta.json()
        ![alt text](image-42.png)

        --> Por último, creamos un condicional donde si la respuesta es ok, ejecutamos la función guardarSesion, donde le damos los datos obtenidos y los guardamos en "token" y "usuario". 
        Cargamos la funcion mostrarInterfaz();
        y un alert para dar la bienvenida.
        ![alt text](image-43.png)
      
      --> catch: nos avisa si la conexión petida al servidor no se puede realizar por problemas de conexión. 
    
    6.- Funcion registrarUsuario -->
      --> Aqui tenemos 3 parámetros "nombre", "email", "password", estos son datos que traemos del front que nos proporcionará el usuario que quiere registarse. 
      Qué hacemos con esto?

      --> Dentro de try...catch creamos la petición al back para poder enviarle estos datos y crear el nuevo usuario.

      Cómo lo hacemos? 

      --> Usamos fetch. Creamos de nuevo una variable respuesta donde guardaremos los datos obtenidos de la petición POST. A fetch le indicamos la URL donde queremos que realice la petición, que esta vez será en "www.localhost:3000/api/auth/register".
      ![alt text](image-44.png)

      --> Guardamos los datos en la variable datos, pero como vienen ilegibles para el DOM le damos el método para traducirlo 
      ![alt text](image-45.png)

      --> Si la respuesta es ok ejecutamos la función guardarSesion para que se mantenga abierta una vez registrado el usuario y hacemos lo mismo que el inicio de sesión. Los datos que vienen del back se los damos a los estados "token" y "usuario" para que luego el objeto localStorage pueda usarlo con sus métodos, en este caso "setItem".
      Llamamos a la función mostrarInterfaz() 
      Y creamos un alert para que el usuario vea que el registro fue correcto. 

      --> Si la respuesta es false mostraremos el alert con el mensaje de error en el registro.

      --> catch: Si la conexión no funciona captura el error y nos lo muestra en consola.

    7.- Función mostrarInterfaz() -->
      --> Aquí generaremos todas las interacciones con el front. 

      --> tenemos las vinculaciones hechas con el front a través de document.getElementById("")

      --> Creamos una variable logged y le damos doble negación a estado.usuario, esto nos sirve para convertir NULL a un booleano FALSE, pero la segunda negación lo convierte un booleano TRUE. 
      Con esto podemos usarlo en condicionales. 
      ![alt text](image-46.png)

      --> Ocultamos o no authSection. Si logged es TRUE añadimos la clase hidden que la tenemos en CSS con display: none, por lo que con este condicional le decimos si queremos o no que el formulario de autentificación esté o no oculta, puesto en else le dicimos que si no se cumple "logged" que elimine la clase "hidden".
      ![alt text](image-47.png)

      --> Luego tenemos el condicional que nos muestra, con authNav, el nombre de usuario que ha iniciado la sesión y el botón de cerrar sesión. 
      Si el condicional no se cumple nos muestra el mensaje "Inicia sesión para comprar".
      ![alt text](image-48.png)

    8.- Función configurarEventosLogin() --> 
      --> Creamos todas las relaciones con el DOM
      ![alt text](image-49.png)

      --> Creamos el condicional de donde le preguntamos que si existe "loginForm", que es la variable donde le decimos que es la id del DOM "loginFormElement". Si existe le decimos que loginForm "escuche" el "submit" y creamos la función flecha donde tenemos como parámetro "e" que usamos luego con e.preventDefault (); para que la página no se recargue.
      Abajo le decimos que obtenga los datos de email y password del DOM
      Con estos datos le decimos que realice la función iniciarSesion()
      Por último que reinicie loginForm
      ![alt text](image-50.png)

      --> Hacemos lo mismo con "showRegister" y "showLogin" con el que le decimos que ponga o quite la clase "hidden".
      ![alt text](image-51.png)
      
      --> Por último creamos el evento donde esperamos a que el DOM se cargue para luego llamar las funciones cargarSesionGuardada(), configurarEventosLogin(), mostrarInterfaz(). 
      ![alt text](image-52.png)
# 27. Middleware 


      ------------------------------------------------------------------------------------------------------------------------------------------------------------
# 28. pedidos.model
  Comenzamos importando las conexiones con la BBDD. 

  Antes de crear las funciones tenemos que averiguar que campos tiene la tabla de pedidos en la BBDD para saber que vamos a necesitar.

  TABLA 'pedidos' (cabecera del pedido):
 *    - id (PRIMARY KEY, AUTO_INCREMENT)
 *    - cliente_id (FOREIGN KEY a tabla clientes)
 *    - estado (VARCHAR: 'pendiente', 'pagado',   'enviado', 'entregado', 'cancelado')
 *    - fecha (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

--> Función crearPedido ()-->
  --> En esta función tenemos un parámetro que es clienteId que se llenará con la id del cliente que viene del token del localStorage. 

  --> Creamos un array "result" y realizamos la consulta la BBDD con SQL, donde le decimos que introduzca en la tabla pedidos el cliente_id y el valor es el que viene del front del token que está en localStorage. 
  Con esto luego conseguimos que nos traiga el dato al array "clienteId". 

  --> En return le pedimos que nos devuelva: 
    -->id de pedido, que se crea de forma automática y autoincrementativa en la BBDD,
    -->cliente_id, que nos trae la id del cliente que creó el pedido.
    -->estado, que nace como "pendiente". 
   
--> Función agregarProductoAPedido()-->
  Aquí estamos creando una tabla intermedia donde todas las relaciones confluyen, pero no tiene ninguna

  --> Aquí podemos encontrarnos 3 parámetros "pedidoID", "productoId", "cantidad". Estos valores los vienen del front. 
    ![alt text](image-54.png)

  --> Creamos un array, igual que el de arriba donde realizaremos la consulta a la BBDD en SQL y nos traemos los datos de nuevo, para luego decirle a return que queremos que nos devuelva. 
![alt text](image-55.png)
  --> return --> Nos devuelve un objeto con la id autoincrementada de la tabla pedidos_productos y el resto de datos que solicitamos 
  ![alt text](image-53.png)

--> Función obtenerPedidoPorId -->
  --> Aquí traemos el parámetro id, que será el id del pedido que viene del front
  --> Realizamos la consulta a la tabla pedidos de donde traemos los datos de "id", "cliente_id", "estado", "fecha" desde la id que le traemos desde el front. 
  ![alt text](image-56.png)

  --> Por último le pedimos que nos devuelva todo. 
  ![alt text](image-57.png)

--> Función obtenerLineasDePedido(idPedido)-->
  --> Traemos la id de la tabla pedido y la usamos en el parámetro para luego realizar la consulta a la BBDD con SQL. 

  --> La consulta que realizamos es para que nos traiga la id de pedidos_productos y la cantidad y también nos trae de la tabla nombre, precio y la imagen de la tabla productos. Así podemos generar una tabla donde aperezcan todos estos datos consutados. 
  ![alt text](image-58.png)

  --> return: Para traernos la consulta llamamos a rows en return.  
  ![alt text](image-59.png)

--> Función obtenerPedidosDeCliente -->
  --> Aquí queremos traer un listado de todos los pedidos del cliente, para ello debemos realizar una consulta a la BBDD que la haremos de la siguiente forma: 
    --> Usamos clienteId que traemos de localStorage y como las tablas de cliente y pedidos están relacionadas realizamos la consulta sabiendo esto. 
    --> Como siempre, creamos un array y desde aquí realizamos la consulta usando SQL en la que solicitamos la id, cliente_id,estado y fecha desde la tabla pedidos usando cliente_id que lo traemos desde el front y le indicamos que nos lo ordene de forma descendiente. 
    ![alt text](image-60.png)

    --> Por último le decimos que nos lo devuelva para poder usarlo luego y mostrarlo en el front. 
  ![alt text](image-61.png)

--> Función actualizarEstado () -->
  --> Aquí queremos poder actualizar los estados de los pedidos para conocer sus cambios, para ellos usamos los parámetros idPedido y nuevoEstado que traemos desde la BBDD. 

  --> Aquí realizamos la función de consulta donde actulizamos el estado mediente SQL que sería así: 
  ![alt text](image-62.png)

  --> Por último pedimos que nos devuelva idPedido como id y estado como nuevoEstado. 
  ![alt text](image-63.png)

--> Función crear() -->
  --> Esta vez tenemos un objeto formado por "cliente_id" y "productos" donde ambos pueden traer muchos datos por lo que es un array. 
  
  --> Dentro de try...catch
    --> Creamos la variable pedido donde llamamos a la función crearPedido con el parámetro "cliente_id"
    ![alt text](image-64.png)

    --> Creamos la variable productosAgregados que será una array para traer muchos productos. 

    --> Usamos un bucle for  