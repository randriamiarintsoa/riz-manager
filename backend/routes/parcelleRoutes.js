
const express = require("express");
const router = express.Router();

const {
  getParcelles,
  getParcelleById,
  createParcelle,
  updateParcelle,
  deleteParcelle,
} = require("../controllers/parcelleController");

// GET : récupérer toutes les parcelles
router.get("/", getParcelles);

// GET : récupérer une parcelle par ID
router.get("/:id", getParcelleById);

// POST : ajouter une parcelle
router.post("/", createParcelle);

// PUT : modifier une parcelle
router.put("/:id", updateParcelle);

// DELETE : supprimer une parcelle
router.delete("/:id", deleteParcelle);

module.exports = router;
