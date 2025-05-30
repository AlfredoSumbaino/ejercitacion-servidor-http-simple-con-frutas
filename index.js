const http = require('http');
const url = require('url');

// Cambiar esta función por la lectura del archivo de frutas con fs
function leerFrutas() { 
  const frutasData = [
    { id: 1, nombre: 'manzana', color: 'rojo' },
    { id: 2, nombre: 'banana', color: 'amarillo' },
    { id: 3, nombre: 'naranja', color: 'naranja' },
    { id: 4, nombre: 'uva', color: 'morado' },
    { id: 5, nombre: 'fresa', color: 'rojo' },
    { id: 6, nombre: 'manzana verde', color: 'verde' }
  ];
  console.log("Simulando lectura de frutas...");
  return frutasData;
}

// Crear el servidor HTTP
const servidor = http.createServer((req, res) => {
  // Configurar el header de respuesta como JSON
  res.setHeader('Content-Type', 'application/json');
  
  // Obtener la ruta de la URL
  const path = url.parse(req.url).pathname;
  
  // TODO: Implementar el manejo de las siguientes rutas:
  // 1. '/' - Mensaje de bienvenida
  if (path === '/') {
    res.statusCode = 200;
    res.end(JSON.stringify({ mensaje: 'Bienvenido al servidor de frutas' }));
    return;
  }
  // 2. '/frutas/all' - Devolver todas las frutas
  if (path === '/frutas/all') {
    const frutas = leerFrutas();
    res.statusCode = 200;
    res.end(JSON.stringify(frutas));
    return;
  }
  // 3. '/frutas/id/123' - Devolver una fruta por su ID
  const idFruta = path.match(/\/frutas\/id\/(.+)/);
  if (idFruta) {
    const id = parseInt(idFruta[1], 10);
    if (isNaN(id)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'ID inválido' }));
      return;
    }
    const frutas = leerFrutas();
    const fruta = frutas.find(f => f.id === id);
    if (fruta) {
      res.statusCode = 200;
      res.end(JSON.stringify(fruta));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Fruta no encontrada: '+ id }));
    }
    return;
  }
  // 4. '/frutas/nombre/manzana' - Buscar frutas por nombre (parcial)
  const nombreMatch = path.match(/\/frutas\/nombre\/(.+)/);
  if (nombreMatch) {
    const nombre = nombreMatch[1].toLowerCase();
    const frutas = leerFrutas();
    const frutasEncontradas = frutas.filter(f => f.nombre.toLowerCase().includes(nombre));
    res.statusCode = 200;
    res.end(JSON.stringify(frutasEncontradas));
    return;
  }
  // 5. '/frutas/existe/manzana' - Verificar si existe una fruta
  const existeMatch = path.match(/\/frutas\/existe\/(.+)/);
  if (existeMatch) {
    const nombre = existeMatch[1].toLowerCase();
    const frutas = leerFrutas();
    const existe = frutas.some(f => f.nombre.toLowerCase() === nombre);
    res.statusCode = 200;
    res.end(JSON.stringify({ existe }));
    return;
  }
  // 6. Cualquier otra ruta - Error 404
  
  // Por ahora, devolvemos un 404 para todas las rutas
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

// Iniciar el servidor
const PUERTO = 3000;
servidor.listen(PUERTO, () => {
  console.log(`Servidor corriendo en http://localhost:${PUERTO}/`);
  console.log(`Rutas disponibles:`);
  console.log(`- http://localhost:${PUERTO}/`);
  console.log(`- http://localhost:${PUERTO}/frutas/all`);
  console.log(`- http://localhost:${PUERTO}/frutas/id/:id`);
  console.log(`- http://localhost:${PUERTO}/frutas/nombre/:nombre`);
  console.log(`- http://localhost:${PUERTO}/frutas/existe/:nombre`);
});