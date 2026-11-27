
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  MapPin,
  LandPlot,
} from "lucide-react";

import api from "../services/api";

const initialFormData = {
  nom: "",
  cultivateur: "",
  superficie: "",
  unite: "are",
  localisation: "",
  description: "",
  statut: "Active",
};

function Parcelles() {
  const [parcelles, setParcelles] = useState([]);
  const [cultivateurs, setCultivateurs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingParcelle, setEditingParcelle] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // Récupérer les parcelles
  const fetchParcelles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/parcelles");
      setParcelles(response.data);
    } catch (err) {
      console.error("Erreur lors du chargement des parcelles :", err);
      setError(
        err.response?.data?.message ||
          "Impossible de charger les parcelles."
      );
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les cultivateurs
  const fetchCultivateurs = async () => {
    try {
      const response = await api.get("/cultivateurs");
  
      const liste = Array.isArray(response.data)
        ? response.data
        : response.data?.data;
  
      setCultivateurs(Array.isArray(liste) ? liste : []);
    } catch (err) {
      console.error("Erreur lors du chargement des cultivateurs :", err);
      setCultivateurs([]);
    }
  };

  // Ouvrir le formulaire d'ajout
  const openForm = () => {
    setEditingParcelle(null);
    setFormData(initialFormData);
    setFormError("");
    setShowForm(true);
  };

  // Fermer le formulaire
  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingParcelle(null);
    setFormData(initialFormData);
    setFormError("");
  };

  // Gérer les changements des champs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Ouvrir le formulaire en mode modification
  const handleEdit = (parcelle) => {
    setEditingParcelle(parcelle);

    setFormData({
      nom: parcelle.nom || "",
      cultivateur:
        parcelle.cultivateur?._id || parcelle.cultivateur || "",
      superficie: parcelle.superficie ?? "",
      unite: parcelle.unite || "are",
      localisation: parcelle.localisation || "",
      description: parcelle.description || "",
      statut: parcelle.statut || "Active",
    });

    setFormError("");
    setShowForm(true);
  };

  // Ajouter ou modifier une parcelle
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (Number(formData.superficie) <= 0) {
      setFormError("La superficie doit être supérieure à zéro.");
      return;
    }

    try {
      setSaving(true);

      const data = {
        ...formData,
        superficie: Number(formData.superficie),
      };

      if (editingParcelle) {
        await api.put(`/parcelles/${editingParcelle._id}`, data);
        alert("Parcelle modifiée avec succès !");
      } else {
        await api.post("/parcelles", data);
        alert("Parcelle ajoutée avec succès !");
      }

      closeForm();
      await fetchParcelles();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);

      setFormError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Impossible d'enregistrer la parcelle."
      );
    } finally {
      setSaving(false);
    }
  };

  // Supprimer une parcelle
  const handleDelete = async (parcelle) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la parcelle "${parcelle.nom}" ?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/parcelles/${parcelle._id}`);

      setParcelles((previous) =>
        previous.filter((item) => item._id !== parcelle._id)
      );

      alert("Parcelle supprimée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);

      alert(
        err.response?.data?.message ||
          "Impossible de supprimer cette parcelle."
      );
    }
  };

  // Recherche des parcelles
  const filteredParcelles = useMemo(() => {
    return parcelles.filter((parcelle) => {
      const nom = (parcelle.nom || "").toLowerCase();
      const localisation = (
        parcelle.localisation || ""
      ).toLowerCase();

      const cultivateur = parcelle.cultivateur
        ? `${parcelle.cultivateur.nom || ""} ${
            parcelle.cultivateur.prenom || ""
          }`.toLowerCase()
        : "";

      const recherche = search.toLowerCase();

      return (
        nom.includes(recherche) ||
        localisation.includes(recherche) ||
        cultivateur.includes(recherche)
      );
    });
  }, [parcelles, search]);

  return (
    <section style={styles.page}>
      {/* En-tête */}
      <div style={styles.heading}>
        <div>
          <h2 style={styles.title}>Gestion des parcelles</h2>
          <p style={styles.subtitle}>
            Consultez et gérez les parcelles agricoles de votre coopérative.
          </p>
        </div>

        <button style={styles.addButton} onClick={openForm}>
          <Plus size={17} />
          Nouvelle parcelle
        </button>
      </div>

      {/* Résumé */}
      <div style={styles.summary}>
        <div style={styles.summaryIcon}>
          <LandPlot size={23} />
        </div>

        <div>
          <span style={styles.summaryLabel}>Total des parcelles</span>
          <strong style={styles.summaryNumber}>
            {parcelles.length}
          </strong>
        </div>
      </div>

      {/* Tableau des parcelles */}
      <div style={styles.panel}>
        <div style={styles.toolbar}>
          <div>
            <h3 style={styles.panelTitle}>Liste des parcelles</h3>
            <p style={styles.resultCount}>
              {filteredParcelles.length} résultat(s)
            </p>
          </div>

          <div style={styles.actions}>
            <div style={styles.searchBox}>
              <Search size={17} color="#6b7280" />

              <input
                type="text"
                placeholder="Rechercher une parcelle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <button
              style={styles.refreshButton}
              onClick={fetchParcelles}
              title="Actualiser"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={styles.message}>
            Chargement des parcelles...
          </div>
        ) : error ? (
          <div style={styles.error}>
            {error}
            <button onClick={fetchParcelles} style={styles.retryButton}>
              Réessayer
            </button>
          </div>
        ) : filteredParcelles.length === 0 ? (
          <div style={styles.message}>
            Aucune parcelle trouvée.
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Cultivateur</th>
                  <th style={styles.th}>Superficie</th>
                  <th style={styles.th}>Localisation</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredParcelles.map((parcelle) => (
                  <tr key={parcelle._id}>
                    <td style={styles.td}>
                      <strong>{parcelle.nom}</strong>
                    </td>

                    <td style={styles.td}>
                      {parcelle.cultivateur
                        ? `${parcelle.cultivateur.nom || ""} ${
                            parcelle.cultivateur.prenom || ""
                          }`
                        : "Non renseigné"}
                    </td>

                    <td style={styles.td}>
                      {parcelle.superficie} {parcelle.unite}
                    </td>

                    <td style={styles.td}>
                      <span style={styles.location}>
                        <MapPin size={14} />
                        {parcelle.localisation}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.status,
                          ...(parcelle.statut === "Active"
                            ? styles.active
                            : styles.inactive),
                        }}
                      >
                        {parcelle.statut}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <div style={styles.rowActions}>
                        <button
                          title="Modifier"
                          style={styles.editButton}
                          onClick={() => handleEdit(parcelle)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          title="Supprimer"
                          style={styles.deleteButton}
                          onClick={() => handleDelete(parcelle)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulaire d'ajout et de modification */}
      {showForm && (
        <div
          style={styles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
            style={styles.modal}
          >
            <div style={styles.modalHeader}>
              <div>
                <h2 id="form-title" style={styles.modalTitle}>
                  {editingParcelle
                    ? "Modifier la parcelle"
                    : "Nouvelle parcelle"}
                </h2>

                <p style={styles.modalDescription}>
                  Renseignez les informations de la parcelle agricole.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                style={styles.closeButton}
                aria-label="Fermer"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label htmlFor="nom">Nom de la parcelle *</label>
                  <input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ex : Parcelle Nord"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="cultivateur">Cultivateur *</label>
                  <select
                    id="cultivateur"
                    name="cultivateur"
                    value={formData.cultivateur}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  >
                    <option value="">Sélectionner un cultivateur</option>

                    {cultivateurs
                      .filter(
                        (cultivateur) =>
                          cultivateur.statut === "Actif" ||
                          (editingParcelle &&
                            cultivateur._id === formData.cultivateur)
                      )
                      .map((cultivateur) => (
                        <option
                          key={cultivateur._id}
                          value={cultivateur._id}
                        >
                          {cultivateur.nom} {cultivateur.prenom}
                        </option>
                      ))}
                  </select>
                </div>

                <div style={styles.field}>
                  <label htmlFor="superficie">Superficie *</label>
                  <input
                    id="superficie"
                    name="superficie"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.superficie}
                    onChange={handleChange}
                    placeholder="Ex : 2.5"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="unite">Unité *</label>
                  <select
                    id="unite"
                    name="unite"
                    value={formData.unite}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  >
                    <option value="hectare">Hectare</option>
                    <option value="are">Are</option>
                    <option value="m²">m²</option>
                  </select>
                </div>

                <div style={styles.fieldFull}>
                  <label htmlFor="localisation">Localisation *</label>
                  <input
                    id="localisation"
                    name="localisation"
                    value={formData.localisation}
                    onChange={handleChange}
                    placeholder="Ex : Ambohitrarahaba"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldFull}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description de la parcelle..."
                    rows="3"
                    style={styles.textarea}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="statut">Statut</label>
                  <select
                    id="statut"
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    style={styles.input}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div style={styles.formError}>
                  {formError}
                </div>
              )}

              <div style={styles.formFooter}>
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  style={styles.cancelButton}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={styles.submitButton}
                >
                  {saving
                    ? "Enregistrement..."
                    : editingParcelle
                      ? "Enregistrer les modifications"
                      : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

const styles = {
  page: {
    width: "100%",
    color: "#1f2937",
  },
  heading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "25px",
  },
  title: {
    margin: 0,
    fontSize: "23px",
    color: "#1f2937",
  },
  subtitle: {
    marginTop: "7px",
    color: "#6b7280",
    fontSize: "14px",
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 17px",
    border: "none",
    borderRadius: "7px",
    background: "#278b5c",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
  },
  summary: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "18px",
    width: "fit-content",
    minWidth: "220px",
    marginBottom: "25px",
  },
  summaryIcon: {
    display: "flex",
    padding: "13px",
    borderRadius: "9px",
    background: "#e8f5ee",
    color: "#278b5c",
  },
  summaryLabel: {
    display: "block",
    color: "#6b7280",
    fontSize: "13px",
  },
  summaryNumber: {
    display: "block",
    marginTop: "5px",
    fontSize: "23px",
  },
  panel: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    padding: "20px",
  },
  panelTitle: {
    margin: 0,
    fontSize: "17px",
  },
  resultCount: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "13px",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    padding: "9px 11px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "13px",
    minWidth: "190px",
  },
  refreshButton: {
    display: "flex",
    padding: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    background: "#ffffff",
    cursor: "pointer",
  },
  message: {
    padding: "35px 15px",
    textAlign: "center",
    color: "#6b7280",
  },
  error: {
    padding: "25px",
    color: "#b91c1c",
    textAlign: "center",
  },
  retryButton: {
    marginLeft: "10px",
    padding: "7px 12px",
    cursor: "pointer",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    fontSize: "13px",
  },
  th: {
    padding: "14px 16px",
    background: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    color: "#4b5563",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "15px 16px",
    borderBottom: "1px solid #e5e7eb",
    verticalAlign: "middle",
  },
  location: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  status: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
  },
  active: {
    background: "#dcfce7",
    color: "#166534",
  },
  inactive: {
    background: "#fee2e2",
    color: "#991b1b",
  },
  rowActions: {
    display: "flex",
    gap: "8px",
  },
  editButton: {
    display: "flex",
    padding: "7px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    background: "#ffffff",
    color: "#2563eb",
    cursor: "pointer",
  },
  deleteButton: {
    display: "flex",
    padding: "7px",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    background: "#ffffff",
    color: "#dc2626",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
    overflowY: "auto",
  },
  modal: {
    background: "#ffffff",
    width: "100%",
    maxWidth: "650px",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "14px",
    padding: "25px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "25px",
  },
  modalTitle: {
    margin: 0,
    fontSize: "21px",
    color: "#1f2937",
  },
  modalDescription: {
    marginTop: "7px",
    marginBottom: 0,
    color: "#6b7280",
    fontSize: "13px",
  },
  closeButton: {
    border: "none",
    background: "#f3f4f6",
    borderRadius: "8px",
    padding: "8px",
    cursor: "pointer",
    display: "flex",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  fieldFull: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    gridColumn: "1 / -1",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    outlineColor: "#278b5c",
    background: "#ffffff",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "7px",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  formError: {
    marginTop: "18px",
    padding: "12px",
    color: "#b91c1c",
    background: "#fee2e2",
    borderRadius: "7px",
    fontSize: "13px",
  },
  formFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "25px",
  },
  cancelButton: {
    padding: "11px 18px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    borderRadius: "7px",
    cursor: "pointer",
  },
  submitButton: {
    padding: "11px 20px",
    border: "none",
    background: "#278b5c",
    color: "#ffffff",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default Parcelles;
