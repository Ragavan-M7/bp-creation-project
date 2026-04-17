// server.js
// Express app entry point
// Flow: Request → CORS → JSON parse → Routes → Controller → DB → Response

require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const bpRoutes     = require('./routes/bpRoutes');
const errorHandler = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:4200',  // Angular dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());            // Parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
// All BP routes prefixed with /api/bp
app.use('/api/bp', bpRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.path} not found` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 BP Creation API running at http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   GET    /api/bp`);
  console.log(`   POST   /api/bp`);
  console.log(`   GET    /api/bp/:id`);
  console.log(`   PUT    /api/bp/:id`);
  console.log(`   DELETE /api/bp/:id\n`);
});
