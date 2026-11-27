
const mongoose = require("mongoose");

const parcelleSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de la parcelle est obligatoire"],
      trim: true,
    },

    cultivateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cultivateur",
      required: [true, "Le cultivateur est obligatoire"],
    },

    superficie: {
      type: Number,
      required: [true, "La superficie est obligatoire"],
      min: [0.01, "La superficie doit être supérieure à zéro"],
    },

    unite: {
      type: String,
      enum: ["hectare", "are", "m²"],
      required: [true, "L'unité de superficie est obligatoire"],
      default: "are",
    },

    localisation: {
      type: String,
      required: [true, "La localisation est obligatoire"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    statut: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Parcelle", parcelleSchema);
