
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cultivateurRoutes = require("./routes/cultivateurRoutes");

const app = express();

// Connexion à MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route d'accueil
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bienvenue sur l'API RizManager"
  });
});

// Vérification API
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API RizManager opérationnelle"
  });
});

// Routes des cultivateurs
app.use("/api/cultivateurs", cultivateurRoutes);

// Démarrage serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
