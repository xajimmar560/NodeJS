// ============================================
// IMPORTACIONES
// ============================================
const express = require("express");
const path = require("path");
const cors = require("cors");
const { logMensaje } = require("./utils/logger.js");

// Rutas de la API
const croquetaRoutes = require("./routes/croquetaRoutes");
const ingredienteRoutes = require("./routes/ingredienteRoutes");

// ============================================
// INICIALIZACIÓN
// ============================================
const app = express();

const port = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE - PARSEO
// ============================================
app.use(express.json());

// ============================================
// MIDDLEWARE - CORS - Cualquier origen
// ============================================
app.use(cors());

// ============================================
// MIDDLEWARE - ARCHIVOS ESTÁTICOS
// ============================================
app.use(express.static(path.join(__dirname, "public")));

// ============================================
// RUTAS - API REST
// ============================================
app.use("/api/croquetas", croquetaRoutes);
app.use("/api/ingredientes", ingredienteRoutes);

// ============================================
// RUTAS - SPA (Catch-all)
// ============================================
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// ============================================
// SERVIDOR
// ============================================
if (process.env.NODE_ENV !== "test") {
app.listen(port, () => {
  logMensaje(`Servidor escuchando en el puerto ${port}`);
})};
module.exports = app;