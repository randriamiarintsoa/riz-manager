
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Sprout,
} from "lucide-react";

import api from "../services/api";

const initialFormData = {
  nom: "",
  annee: new Date().getFullYear(),
  dateDebut: "",
  dateFin: "",
  description: "",
  statut: "Planifiée",
};

function Campagnes() {
  const [campagnes, setCampagnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCampagne, setEditingCampagne] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const fetchCampagnes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/campagnes");
      const liste = Array.isArray(response.data)
        ? response.data
        : response.data?.data;

      setCampagnes(Array.isArray(liste) ? liste : []);
    } catch (err) {
      console.error("Erreur chargement campagnes :", err);
      setError(
        err.response?.data?.message ||
        "Impossible de charger les campagnes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampagnes();
  }, []);

  const openForm = () => {
    setEditingCampagne(null);
    setFormData(initialFormData);
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingCampagne(null);
    setFormData(initialFormData);
    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = (campagne) => {
    setEditingCampagne(campagne);

    setFormData({
      nom: campagne.nom || "",
      annee: campagne.annee || new Date().getFullYear(),
      dateDebut: campagne.dateDebut
        ? campagne.dateDebut.slice(0, 10)
        : "",
      dateFin: campagne.dateFin
        ? campagne.dateFin.slice(0, 10)
        : "",
      description: campagne.description || "",
      statut: campagne.statut || "Planifiée",
    });

    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (new Date(formData.dateFin) < new Date(formData.dateDebut)) {
      setFormError("La date de fin doit être après la date de début.");
      return;
    }

    try {
      setSaving(true);

      const data = {
        ...formData,
        annee: Number(formData.annee),
      };

      if (editingCampagne) {
        await api.put(`/campagnes/${editingCampagne._id}`, data);
      } else {
        await api.post("/campagnes", data);
      }

      setShowForm(false);
      setEditingCampagne(null);
      setFormData(initialFormData);

      await fetchCampagnes();

      alert(
        editingCampagne
          ? "Campagne modifiée avec succès !"
          : "Campagne ajoutée avec succès !"
      );
    } catch (err) {
      console.error("Erreur enregistrement campagne :", err);
      setFormError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Impossible d'enregistrer la campagne."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (campagne) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la campagne "${campagne.nom}" ?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/campagnes/${campagne._id}`);
      setCampagnes((previous) =>
        previous.filter((item) => item._id !== campagne._id)
      );
      alert("Campagne supprimée avec succès !");
    } catch (err) {
      console.error("Erreur suppression campagne :", err);
      alert(
        err.response?.data?.message ||
        "Impossible de supprimer cette campagne."
      );
    }
  };

  const filteredCampagnes = useMemo(() => {
    const recherche = search.toLowerCase();

    return campagnes.filter((campagne) =>
      `${campagne.nom || ""} ${campagne.annee || ""} ${campagne.statut || ""}`
        .toLowerCase()
        .includes(recherche)
    );
  }, [campagnes, search]);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const statusStyle = (statut) => {
    if (statut === "En cours") return styles.inProgress;
    if (statut === "Terminée") return styles.completed;
    if (statut === "Annulée") return styles.cancelled;
    return styles.planned;
  };

  return (
    <section style={styles.page}>
      <div style={styles.heading}>
        <div>
          <h2 style={styles.title}>Gestion des campagnes</h2>
          <p style={styles.subtitle}>
            Organisez et suivez les campagnes agricoles de votre coopérative.
          </p>
        </div>

        <button style={styles.addButton} onClick={openForm}>
          <Plus size={17} />
          Nouvelle campagne
        </button>
      </div>

      <div style={styles.summary}>
        <div style={styles.summaryIcon}>
          <Sprout size={23} />
        </div>
        <div>
          <span style={styles.summaryLabel}>Total des campagnes</span>
          <strong style={styles.summaryNumber}>{campagnes.length}</strong>
        </div>
      </div>

      <div style={styles.panel}>
        <div style={styles.toolbar}>
          <div>
            <h3 style={styles.panelTitle}>Liste des campagnes</h3>
            <p style={styles.resultCount}>
              {filteredCampagnes.length} résultat(s)
            </p>
          </div>

          <div style={styles.actions}>
            <div style={styles.searchBox}>
              <Search size={17} color="#6b7280" />
              <input
                type="text"
                placeholder="Rechercher une campagne..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <button
              style={styles.refreshButton}
              onClick={fetchCampagnes}
              title="Actualiser"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={styles.message}>Chargement des campagnes...</div>
        ) : error ? (
          <div style={styles.error}>
            {error}
            <button onClick={fetchCampagnes} style={styles.retryButton}>
              Réessayer
            </button>
          </div>
        ) : filteredCampagnes.length === 0 ? (
          <div style={styles.message}>Aucune campagne trouvée.</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nom</th>
                  <th style={styles.th}>Année</th>
                  <th style={styles.th}>Date de début</th>
                  <th style={styles.th}>Date de fin</th>
                  <th style={styles.th}>Statut</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCampagnes.map((campagne) => (
                  <tr key={campagne._id}>
                    <td style={styles.td}>
                      <strong>{campagne.nom}</strong>
                    </td>
                    <td style={styles.td}>{campagne.annee}</td>
                    <td style={styles.td}>{formatDate(campagne.dateDebut)}</td>
                    <td style={styles.td}>{formatDate(campagne.dateFin)}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.status,
                        ...statusStyle(campagne.statut),
                      }}>
                        {campagne.statut}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.rowActions}>
                        <button
                          title="Modifier"
                          style={styles.editButton}
                          onClick={() => handleEdit(campagne)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title="Supprimer"
                          style={styles.deleteButton}
                          onClick={() => handleDelete(campagne)}
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
            aria-labelledby="campagne-form-title"
            style={styles.modal}
          >
            <div style={styles.modalHeader}>
              <div>
                <h2 id="campagne-form-title" style={styles.modalTitle}>
                  {editingCampagne ? "Modifier la campagne" : "Nouvelle campagne"}
                </h2>
                <p style={styles.modalDescription}>
                  Renseignez les informations de la campagne agricole.
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
                  <label htmlFor="nom">Nom de la campagne *</label>
                  <input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ex : Campagne rizicole 2026-2027"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="annee">Année *</label>
                  <input
                    id="annee"
                    name="annee"
                    type="number"
                    min="2000"
                    value={formData.annee}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="dateDebut">Date de début *</label>
                  <input
                    id="dateDebut"
                    name="dateDebut"
                    type="date"
                    value={formData.dateDebut}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="dateFin">Date de fin *</label>
                  <input
                    id="dateFin"
                    name="dateFin"
                    type="date"
                    min={formData.dateDebut || undefined}
                    value={formData.dateFin}
                    onChange={handleChange}
                    required
                    style={styles.input}
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
                    <option value="Planifiée">Planifiée</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminée">Terminée</option>
                    <option value="Annulée">Annulée</option>
                  </select>
                </div>

                <div style={styles.fieldFull}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description de la campagne..."
                    rows="3"
                    style={styles.textarea}
                  />
                </div>
              </div>

              {formError && <div style={styles.formError}>{formError}</div>}

              <div style={styles.formActions}>
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
                    : editingCampagne
                    ? "Enregistrer les modifications"
                    : "Ajouter la campagne"}
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
  page: { display: "flex", flexDirection: "column", gap: 22 },
  heading: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap", gap: 16,
  },
  title: { margin: 0, color: "#1f2937", fontSize: 23, fontWeight: 700 },
  subtitle: { margin: "7px 0 0", color: "#6b7280", fontSize: 14 },
  addButton: {
    display: "flex", alignItems: "center", gap: 8,
    border: "none", borderRadius: 9, padding: "11px 16px",
    background: "#269b61", color: "#fff", fontWeight: 600,
    cursor: "pointer",
  },
  summary: {
    display: "flex", alignItems: "center", gap: 15,
    padding: 20, background: "#fff", border: "1px solid #e8eee9",
    borderRadius: 12, width: "fit-content", minWidth: 230,
  },
  summaryIcon: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 48, height: 48, borderRadius: 12,
    background: "#e7f5ed", color: "#269b61",
  },
  summaryLabel: { display: "block", color: "#6b7280", fontSize: 13 },
  summaryNumber: {
    display: "block", marginTop: 4, color: "#1f2937",
    fontSize: 25, fontWeight: 700,
  },
  panel: {
    background: "#fff", border: "1px solid #e8eee9",
    borderRadius: 12, overflow: "hidden",
  },
  toolbar: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", flexWrap: "wrap", gap: 16, padding: 20,
  },
  panelTitle: { margin: 0, color: "#1f2937", fontSize: 16 },
  resultCount: { margin: "5px 0 0", color: "#9ca3af", fontSize: 13 },
  actions: { display: "flex", alignItems: "center", gap: 9 },
  searchBox: {
    display: "flex", alignItems: "center", gap: 8,
    border: "1px solid #e5e7eb", borderRadius: 8, padding: "0 10px",
  },
  searchInput: {
    width: 210, maxWidth: "100%", border: "none",
    outline: "none", padding: "10px 0", fontSize: 13,
  },
  refreshButton: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 38, height: 38, border: "1px solid #e5e7eb",
    borderRadius: 8, background: "#fff", color: "#4b5563",
    cursor: "pointer",
  },
  message: { padding: 35, textAlign: "center", color: "#6b7280" },
  error: { padding: 25, color: "#dc2626", textAlign: "center" },
  retryButton: {
    display: "block", margin: "12px auto 0", padding: "8px 14px",
    border: "1px solid #dc2626", borderRadius: 7,
    background: "#fff", color: "#dc2626", cursor: "pointer",
  },
  tableWrapper: { width: "100%", overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 780 },
  th: {
    padding: "13px 17px", textAlign: "left", background: "#f8faf8",
    color: "#6b7280", fontSize: 12, fontWeight: 600,
    borderTop: "1px solid #edf0ed", borderBottom: "1px solid #edf0ed",
  },
  td: {
    padding: "15px 17px", color: "#4b5563", fontSize: 13,
    borderBottom: "1px solid #f0f2f0",
  },
  status: {
    display: "inline-block", padding: "5px 10px",
    borderRadius: 20, fontSize: 11, fontWeight: 600,
  },
  planned: { background: "#eff6ff", color: "#2563eb" },
  inProgress: { background: "#ecfdf5", color: "#059669" },
  completed: { background: "#f3f4f6", color: "#4b5563" },
  cancelled: { background: "#fef2f2", color: "#dc2626" },
  rowActions: { display: "flex", alignItems: "center", gap: 8 },
  editButton: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 32, height: 32, border: "1px solid #dbeafe",
    borderRadius: 7, background: "#eff6ff", color: "#2563eb",
    cursor: "pointer",
  },
  deleteButton: {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 32, height: 32, border: "1px solid #fee2e2",
    borderRadius: 7, background: "#fef2f2", color: "#dc2626",
    cursor: "pointer",
  },
  location: { display: "inline-flex", alignItems: "center", gap: 5 },
  overlay: {
    position: "fixed", inset: 0, zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 20, background: "rgba(15,23,42,0.48)",
  },
  modal: {
    width: "100%", maxWidth: 650, maxHeight: "90vh",
    overflowY: "auto", background: "#fff", borderRadius: 14,
    padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },
  modalHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "flex-start", gap: 15, marginBottom: 22,
  },
  modalTitle: { margin: 0, color: "#1f2937", fontSize: 20 },
  modalDescription: { margin: "6px 0 0", color: "#6b7280", fontSize: 13 },
  closeButton: {
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "none", background: "transparent", color: "#6b7280",
    cursor: "pointer",
  },
  formGrid: {
    display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 17,
  },
  field: { display: "flex", flexDirection: "column", gap: 7 },
  fieldFull: {
    display: "flex", flexDirection: "column", gap: 7, gridColumn: "1 / -1",
  },
  input: {
    width: "100%", boxSizing: "border-box", padding: "10px 12px",
    border: "1px solid #d1d5db", borderRadius: 8,
    outlineColor: "#269b61", fontSize: 13,
  },
  textarea: {
    width: "100%", boxSizing: "border-box", padding: "10px 12px",
    border: "1px solid #d1d5db", borderRadius: 8,
    outlineColor: "#269b61", fontSize: 13, resize: "vertical",
  },
  formError: {
    marginTop: 15, padding: 11, borderRadius: 7,
    background: "#fef2f2", color: "#dc2626", fontSize: 13,
  },
  formActions: {
    display: "flex", justifyContent: "flex-end",
    flexWrap: "wrap", gap: 10, marginTop: 22,
  },
  cancelButton: {
    padding: "10px 15px", border: "1px solid #d1d5db",
    borderRadius: 8, background: "#fff", color: "#4b5563",
    cursor: "pointer",
  },
  submitButton: {
    padding: "10px 16px", border: "none", borderRadius: 8,
    background: "#269b61", color: "#fff", fontWeight: 600,
    cursor: "pointer",
  },
};

export default Campagnes;
