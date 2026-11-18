const express = require('express');
const router = express.Router();
const Evento = require('../models/evento');
const Recinto = require('../models/recinto');

// GET / - Obtener todos los eventos con la información de su recinto
router.get('/', async (req, res) => {
  try {
    const eventos = await Evento.find().populate('recinto');

    if (eventos.length > 0) {
      res.status(200).json({
        ok: true,
        resultado: eventos
      });
    } else {
      res.status(500).json({
        ok: false,
        error: 'No se han encontrado eventos'
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'No se han encontrado eventos'
    });
  }
});

// GET /localidad/:nombre - Obtener eventos futuros por localidad del recinto
router.get('/localidad/:nombre', async (req, res) => {
  try {
    const nombre = req.params.nombre;
    const eventos = await Evento.find({
      fecha: { $gt: new Date() }
    }).populate('recinto');

    const eventosFiltrados = eventos.filter(
      (evento) =>
        evento.recinto &&
        evento.recinto.localidad.toLowerCase() === nombre.toLowerCase()
    );

    if (eventosFiltrados.length > 0) {
      res.status(200).json({
        ok: true,
        resultado: eventosFiltrados
      });
    } else {
      res.status(404).json({
        ok: false,
        error: 'No se han encontrado eventos'
      });
    }
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: 'No se han encontrado eventos'
    });
  }
});

// GET /entradas/:idEvento/:tipoEntrada - Obtener precio y disponibilidad de una entrada
router.get('/entradas/:idEvento/:tipoEntrada', async (req, res) => {
  const { idEvento, tipoEntrada } = req.params;
  try {
    const evento = await Evento.findById(idEvento);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        error: `Error obteniendo datos de entrada para evento ${idEvento}`
      });
    }

    const entrada = evento.entradas.find(
      (e) => e.tipo.toLowerCase() === tipoEntrada.toLowerCase()
    );

    if (entrada) {
      res.status(200).json({
        ok: true,
        resultado: {
          precio: entrada.precio,
          disponibles: entrada.disponibles
        }
      });
    } else {
      res.status(404).json({
        ok: false,
        error: `Error obteniendo datos de entrada para evento ${idEvento}`
      });
    }
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: `Error obteniendo datos de entrada para evento ${idEvento}`
    });
  }
});

// PUT /entradas/:idEvento/:tipoEntrada/:cantidad - Restar entradas disponibles de un evento
router.put('/entradas/:idEvento/:tipoEntrada/:cantidad', async (req, res) => {
  const { idEvento, tipoEntrada, cantidad } = req.params;
  try {
    const numCantidad = Number(cantidad);

    // Comprobar que sea un número entero positivo (no decimal, no NaN, mayor que cero)
    if (!Number.isInteger(numCantidad) || numCantidad <= 0) {
      return res.status(404).json({
        ok: false,
        error: `Error actualizando entradas del evento ${idEvento}`
      });
    }

    const evento = await Evento.findById(idEvento);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        error: `Error actualizando entradas del evento ${idEvento}`
      });
    }

    const entrada = evento.entradas.find(
      (e) => e.tipo.toLowerCase() === tipoEntrada.toLowerCase()
    );

    if (entrada && entrada.disponibles >= numCantidad) {
      entrada.disponibles -= numCantidad;
      const eventoActualizado = await evento.save();

      res.status(200).json({
        ok: true,
        resultado: eventoActualizado
      });
    } else {
      res.status(404).json({
        ok: false,
        error: `Error actualizando entradas del evento ${idEvento}`
      });
    }
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: `Error actualizando entradas del evento ${idEvento}`
    });
  }
});

// GET /:id - Obtener un evento por su ID con su recinto asociado
router.get('/:id', async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id).populate('recinto');

    if (evento) {
      res.status(200).json({
        ok: true,
        resultado: evento
      });
    } else {
      res.status(404).json({
        ok: false,
        error: `Evento ${req.params.id} no encontrado`
      });
    }
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: `Evento ${req.params.id} no encontrado`
    });
  }
});

// POST / - Crear un nuevo evento
router.post('/', async (req, res) => {
  try {
    const nuevoEvento = new Evento(req.body);
    const eventoCreado = await nuevoEvento.save();

    res.status(201).json({
      ok: true,
      resultado: eventoCreado
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'Error añadiendo evento'
    });
  }
});

// PUT /:id - Actualizar un evento existente
router.put('/:id', async (req, res) => {
  try {
    const eventoActualizado = await Evento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (eventoActualizado) {
      res.status(200).json({
        ok: true,
        resultado: eventoActualizado
      });
    } else {
      res.status(404).json({
        ok: false,
        error: `Error actualizando evento ${req.params.id}`
      });
    }
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: `Error actualizando evento ${req.params.id}`
    });
  }
});

// DELETE /:id - Eliminar un evento por su ID
router.delete('/:id', async (req, res) => {
  try {
    const eventoEliminado = await Evento.findByIdAndDelete(req.params.id);

    if (eventoEliminado) {
      res.status(200).json({
        ok: true,
        resultado: eventoEliminado
      });
    } else {
      res.status(404).json({
        ok: false,
        error: `Error eliminando evento ${req.params.id}`
      });
    }
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: `Error eliminando evento ${req.params.id}`
    });
  }
});

module.exports = router;
