
const Cultivateur = require("../models/Cultivateur");

// Ajouter un cultivateur
exports.createCultivateur = async (req, res) => {
  try {
    const cultivateur = await Cultivateur.create(req.body);

    res.status(201).json({
      success: true,
      message: "Cultivateur ajouté avec succès",
      data: cultivateur,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.code === 11000
        ? "Ce numéro de téléphone existe déjà"
        : error.message,
    });
  }
};

// Afficher tous les cultivateurs
exports.getCultivateurs = async (req, res) => {
  try {
    const cultivateurs = await Cultivateur.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: cultivateurs.length,
      data: cultivateurs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Afficher un cultivateur par ID
exports.getCultivateurById = async (req, res) => {
  try {
    const cultivateur = await Cultivateur.findById(req.params.id);

    if (!cultivateur) {
      return res.status(404).json({
        success: false,
        message: "Cultivateur introuvable",
      });
    }

    res.status(200).json({
      success: true,
      data: cultivateur,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Identifiant invalide",
    });
  }
};

// Modifier un cultivateur
exports.updateCultivateur = async (req, res) => {
  try {
    const cultivateur = await Cultivateur.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!cultivateur) {
      return res.status(404).json({
        success: false,
        message: "Cultivateur introuvable",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cultivateur modifié avec succès",
      data: cultivateur,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.code === 11000
        ? "Ce numéro de téléphone existe déjà"
        : error.message,
    });
  }
};

// Supprimer un cultivateur
exports.deleteCultivateur = async (req, res) => {
  try {
    const cultivateur = await Cultivateur.findByIdAndDelete(
      req.params.id
    );

    if (!cultivateur) {
      return res.status(404).json({
        success: false,
        message: "Cultivateur introuvable",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cultivateur supprimé avec succès",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Identifiant invalide",
    });
  }
};
