const express = require("express");
const router = express.Router();

const {
  createCultivateur,
  getCultivateurs,
  getCultivateurById,
  updateCultivateur,
  deleteCultivateur,
} = require("../controllers/cultivateurController");

// POST : Ajouter un cultivateur
router.post("/", createCultivateur);

// GET : Afficher tous les cultivateurs
router.get("/", getCultivateurs);

// GET : Afficher un cultivateur par ID
router.get("/:id", getCultivateurById);

// PUT : Modifier un cultivateur
router.put("/:id", updateCultivateur);

// DELETE : Supprimer un cultivateur
router.delete("/:id", deleteCultivateur);

module.exports = router;
