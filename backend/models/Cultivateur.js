
const mongoose = require("mongoose");

const cultivateurSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
    },
    prenom: {
      type: String,
      required: [true, "Le prénom est obligatoire"],
      trim: true,
    },
    telephone: {
      type: String,
      required: [true, "Le téléphone est obligatoire"],
      trim: true,
      unique: true,
    },
    adresse: {
      type: String,
      required: [true, "L'adresse est obligatoire"],
      trim: true,
    },
    sexe: {
      type: String,
      enum: ["Masculin", "Féminin"],
      required: true,
    },
    dateNaissance: {
      type: Date,
      default: null,
    },
    cin: {
      type: String,
      trim: true,
      default: null,
    },
    statut: {
      type: String,
      enum: ["Actif", "Inactif"],
      default: "Actif",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cultivateur", cultivateurSchema);
