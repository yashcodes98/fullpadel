const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001; // Puerto en el que se ejecutará el servidor

// Middleware
app.use(cors());  // Habilitar CORS para todas las solicitudes
app.use(express.json());  // Para poder recibir JSON en las solicitudes

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('Servidor Node.js corriendo');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
});
