const express = require('express');
const router = express.Router();
const Recinto = require('../models/recinto');

// GET / - Obtener todos los recintos
router.get('/', async (req, res) => {
  try {
    const recintos = await Recinto.find();

    if (recintos.length > 0) {
      res.status(200).json({
        ok: true,
        resultado: recintos
      });
    } else {
      res.status(500).json({
        ok: false,
        error: 'No se han encontrado recintos'
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'No se han encontrado recintos'
    });
  }
});

// GET /localidad/:nombre - Obtener recintos por localidad
router.get('/localidad/:nombre', async (req, res) => {
  try {
    const nombre = req.params.nombre;
    const recintos = await Recinto.find({ localidad: nombre });

    if (recintos.length > 0) {
      res.status(200).json({
        ok: true,
        resultado: recintos
      });
    } else {
      res.status(404).json({
        ok: false,
        error: 'No se han encontrado recintos de la localidad indicada'
      });
    }
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: 'No se han encontrado recintos de la localidad indicada'
    });
  }
});

// GET /:id - Obtener un recinto por su ID
router.get('/:id', async (req, res) => {
  try {
    const recinto = await Recinto.findById(req.params.id);

    if (recinto) {
      res.status(200).json({
        ok: true,
        resultado: recinto
      });
    } else {
      res.status(404).json({
        ok: false,
        error: `Recinto ${req.params.id} no encontrado`
      });
    }
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: `Recinto ${req.params.id} no encontrado`
    });
  }
});

// POST / - Crear un nuevo recinto
router.post('/', async (req, res) => {
  try {
    const nuevoRecinto = new Recinto(req.body);
    const recintoGuardado = await nuevoRecinto.save();

    res.status(201).json({
      ok: true,
      resultado: recintoGuardado
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: 'Error añadiendo recinto'
    });
  }
});

// DELETE /:id - Eliminar un recinto por su ID
router.delete('/:id', async (req, res) => {
  try {
    const recintoEliminado = await Recinto.findByIdAndDelete(req.params.id);

    if (recintoEliminado) {
      res.status(200).json({
        ok: true,
        resultado: recintoEliminado
      });
    } else {
      res.status(404).json({
        ok: false,
        error: `Error eliminando recinto ${req.params.id}`
      });
    }
  } catch (error) {
    res.status(404).json({
      ok: false,
      error: `Error eliminando recinto ${req.params.id}`
    });
  }
});

module.exports = router;
