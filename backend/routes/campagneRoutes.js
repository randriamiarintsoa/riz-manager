
const express = require("express");
const router = express.Router();

const {
  getCampagnes,
  getCampagneById,
  createCampagne,
  updateCampagne,
  deleteCampagne,
} = require("../controllers/campagneController");

// Liste des campagnes
router.get("/", getCampagnes);

// Détails d'une campagne
router.get("/:id", getCampagneById);

// Ajouter une campagne
router.post("/", createCampagne);

// Modifier une campagne
router.put("/:id", updateCampagne);

// Supprimer une campagne
router.delete("/:id", deleteCampagne);

module.exports = router;
