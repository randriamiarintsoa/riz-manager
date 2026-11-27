
const Parcelle = require("../models/Parcelle");

// Récupérer toutes les parcelles
const getParcelles = async (req, res) => {
  try {
    const parcelles = await Parcelle.find()
      .populate("cultivateur", "nom prenom telephone")
      .sort({ createdAt: -1 });

    res.status(200).json(parcelles);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des parcelles",
      error: error.message,
    });
  }
};

// Récupérer une parcelle par son ID
const getParcelleById = async (req, res) => {
  try {
    const parcelle = await Parcelle.findById(req.params.id)
      .populate("cultivateur", "nom prenom telephone");

    if (!parcelle) {
      return res.status(404).json({
        message: "Parcelle introuvable",
      });
    }

    res.status(200).json(parcelle);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la parcelle",
      error: error.message,
    });
  }
};

// Ajouter une nouvelle parcelle
const createParcelle = async (req, res) => {
  try {
    const {
      nom,
      cultivateur,
      superficie,
      unite,
      localisation,
      description,
      statut,
    } = req.body;

    const nouvelleParcelle = await Parcelle.create({
      nom,
      cultivateur,
      superficie,
      unite,
      localisation,
      description,
      statut,
    });

    const parcelle = await Parcelle.findById(nouvelleParcelle._id)
      .populate("cultivateur", "nom prenom telephone");

    res.status(201).json({
      message: "Parcelle ajoutée avec succès",
      parcelle,
    });
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de l'ajout de la parcelle",
      error: error.message,
    });
  }
};

// Modifier une parcelle
const updateParcelle = async (req, res) => {
  try {
    const parcelle = await Parcelle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("cultivateur", "nom prenom telephone");

    if (!parcelle) {
      return res.status(404).json({
        message: "Parcelle introuvable",
      });
    }

    res.status(200).json({
      message: "Parcelle modifiée avec succès",
      parcelle,
    });
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la modification de la parcelle",
      error: error.message,
    });
  }
};

// Supprimer une parcelle
const deleteParcelle = async (req, res) => {
  try {
    const parcelle = await Parcelle.findByIdAndDelete(req.params.id);

    if (!parcelle) {
      return res.status(404).json({
        message: "Parcelle introuvable",
      });
    }

    res.status(200).json({
      message: "Parcelle supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la parcelle",
      error: error.message,
    });
  }
};

module.exports = {
  getParcelles,
  getParcelleById,
  createParcelle,
  updateParcelle,
  deleteParcelle,
};
