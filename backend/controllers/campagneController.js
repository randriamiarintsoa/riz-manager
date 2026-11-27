
const Campagne = require("../models/Campagne");

// Récupérer toutes les campagnes
exports.getCampagnes = async (req, res) => {
  try {
    const campagnes = await Campagne.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: campagnes.length,
      data: campagnes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des campagnes",
      error: error.message,
    });
  }
};

// Récupérer une campagne par son ID
exports.getCampagneById = async (req, res) => {
  try {
    const campagne = await Campagne.findById(req.params.id);

    if (!campagne) {
      return res.status(404).json({
        success: false,
        message: "Campagne introuvable",
      });
    }

    res.status(200).json({
      success: true,
      data: campagne,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la campagne",
      error: error.message,
    });
  }
};

// Créer une campagne
exports.createCampagne = async (req, res) => {
  try {
    const campagne = await Campagne.create(req.body);

    res.status(201).json({
      success: true,
      message: "Campagne créée avec succès",
      data: campagne,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Erreur lors de la création de la campagne",
      error: error.message,
    });
  }
};

// Modifier une campagne
exports.updateCampagne = async (req, res) => {
  try {
    const campagne = await Campagne.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!campagne) {
      return res.status(404).json({
        success: false,
        message: "Campagne introuvable",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campagne modifiée avec succès",
      data: campagne,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Erreur lors de la modification de la campagne",
      error: error.message,
    });
  }
};

// Supprimer une campagne
exports.deleteCampagne = async (req, res) => {
  try {
    const campagne = await Campagne.findByIdAndDelete(req.params.id);

    if (!campagne) {
      return res.status(404).json({
        success: false,
        message: "Campagne introuvable",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campagne supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la campagne",
      error: error.message,
    });
  }
};
