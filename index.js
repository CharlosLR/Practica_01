require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const recintosRouter = require('./routes/recintos');
const eventosRouter = require('./routes/eventos');

const app = express();

// Middleware para procesar cuerpos de petición en formato JSON
app.use(express.json());

// Registro de enrutadores
app.use('/recintos', recintosRouter);
app.use('/eventos', eventosRouter);

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Función principal asíncrona para conectar a la BD e iniciar el servidor
const iniciarServidor = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('La variable de entorno MONGODB_URI no está definida');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conexión con MongoDB Atlas establecida con éxito');

    app.listen(PORT, () => {
      console.log(`Servidor Express escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error.message);
  }
};

iniciarServidor();
