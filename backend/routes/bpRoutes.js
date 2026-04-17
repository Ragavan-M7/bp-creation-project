// routes/bpRoutes.js
// Maps HTTP method + path → controller function

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/bpController');

// GET    /api/bp          → list all (supports ?search=&status=)
// POST   /api/bp          → create new
// GET    /api/bp/:id      → get single
// PUT    /api/bp/:id      → update
// DELETE /api/bp/:id      → delete

router.get   ('/',    ctrl.getAll);
router.post  ('/',    ctrl.create);
router.get   ('/:id', ctrl.getById);
router.put   ('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
