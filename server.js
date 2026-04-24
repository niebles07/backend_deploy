const express = require('express');
const cors = require('cors'); // 1. Importar el paquete CORS
const app = express();
const PORT = process.env.PORT || 3000;
const { Pool } = require('pg'); // Importamos el pool de conexión de pg


// Configuración específica de CORS
const corsOptions = {
  origin: 'https://frontend-deploy-xh6l.onrender.com', // El único origen permitido
  optionsSuccessStatus: 200 
};
// 2. Habilitar CORS para todas las peticiones
// Esto debe ir SIEMPRE antes de definir tus rutas
app.use(cors(corsOptions));

// Configuración de la conexión a PostgreSQL usando la variable de entorno
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Requerido para conexiones en Render
    }
});

// Ruta para ver los libros desde la BASE DE DATOS
app.get('/libros', async (req, res) => {
    try {
        console.log("Alguien solicitó la lista de libros desde la DB");
        // Consulta SQL para obtener los datos
        const result = await pool.query('SELECT id, nombre, autor, genero, isin FROM libros ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener libros:", err);
        res.status(500).json({ error: "Error al conectar con la base de datos" });
    }
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send("¡Servidor de libros funcionando! Ve a /libros para ver los datos.");
});

app.listen(PORT, () => {
    console.log(`Servidor de prueba encendido en puerto: ${PORT}`);
});
