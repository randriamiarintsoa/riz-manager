
const mongoose = require("mongoose");

const campagneSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de la campagne est obligatoire"],
      trim: true,
    },

    annee: {
      type: Number,
      required: [true, "L'année de la campagne est obligatoire"],
      min: [2000, "L'année doit être valide"],
    },

    dateDebut: {
      type: Date,
      required: [true, "La date de début est obligatoire"],
    },

    dateFin: {
      type: Date,
      required: [true, "La date de fin est obligatoire"],
      validate: {
        validator: function (value) {
          return !this.dateDebut || value >= this.dateDebut;
        },
        message: "La date de fin doit être après la date de début",
      },
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    statut: {
      type: String,
      enum: ["Planifiée", "En cours", "Terminée", "Annulée"],
      default: "Planifiée",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campagne", campagneSchema);
