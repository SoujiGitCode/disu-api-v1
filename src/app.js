const express = require('express');
const bodyParser = require('body-parser');
const api = require('./routes');

const app = express();

// Configuración de middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas centralizadas a través del archivo index.js en la carpeta routes
app.use('/api/v1', api);

// catch-all middleware para rutas no encontradas
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack); // Loggear el error en la consola del servidor
    res.status(500).send('Something is Broken');
});
module.exports = app;
