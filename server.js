const express = require('express');
const app = express();
const routes = require('./routes'); // Importar las rutas
// Hacer que Express sepa que vamos a recibir y enviar JSON
app.use(express.json());
// Usar las rutas
app.use('/api', routes); // Las rutas se manejarán bajo "/api"
// Configurar el puerto y levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});