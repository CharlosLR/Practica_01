const mongoose = require('mongoose');

const entradaSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, 'El tipo de entrada es obligatorio'],
    minlength: [3, 'El tipo de entrada debe tener al menos 3 caracteres'],
    trim: true
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  disponibles: {
    type: Number,
    required: [true, 'Las entradas disponibles son obligatorias'],
    min: [0, 'Las entradas disponibles no pueden ser negativas'],
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} debe ser un número entero'
    }
  }
});

const eventoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    minlength: [5, 'El nombre debe tener al menos 5 caracteres'],
    trim: true
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },
  entradas: [entradaSchema],
  recinto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recinto',
    required: [true, 'El recinto es obligatorio']
  }
});

module.exports = mongoose.model('Evento', eventoSchema);
