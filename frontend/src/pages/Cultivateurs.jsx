
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Users,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import api from "../services/api";
import "./Cultivateurs.css";

const initialForm = {
  nom: "",
  prenom: "",
  telephone: "",
  adresse: "",
  sexe: "",
  dateNaissance: "",
  cin: "",
  statut: "Actif",
};

function Cultivateurs() {
  const [cultivateurs, setCultivateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingCultivateur, setEditingCultivateur] = useState(null);

  // Récupérer les cultivateurs
  const fetchCultivateurs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cultivateurs");
      setCultivateurs(response.data.data || []);
    } catch (err) {
      console.error("Erreur de chargement :", err);
      setError(
        err.response?.data?.message ||
          "Impossible de charger les cultivateurs."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCultivateurs();
  }, []);

  // Modifier les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Ouvrir le formulaire
  // const openForm = () => {
  //   setFormData(initialForm);
  //   setFormError("");
  //   setShowForm(true);
  // };
  const openForm = () => {
    setEditingCultivateur(null);
    setFormData(initialForm);
    setFormError("");
    setShowForm(true);
  };

  // Fermer le formulaire
  const closeForm = () => {
    if (saving) return;
  
    setShowForm(false);
    setEditingCultivateur(null);
    setFormError("");
  };

  // Ajouter un cultivateur
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setFormError("");

  //   try {
  //     setSaving(true);

  //     const dataToSend = {
  //       ...formData,
  //       dateNaissance: formData.dateNaissance || null,
  //       cin: formData.cin.trim() || null,
  //     };

  //     await api.post("/cultivateurs", dataToSend);

  //     if (editingCultivateur) {
  //       await api.put(
  //         `/cultivateurs/${editingCultivateur._id}`,
  //         dataToSend
  //       );
  //     } else {
  //       await api.post("/cultivateurs", dataToSend);
  //     }

  //     setShowForm(false);
  //     setFormData(initialForm);
  //     setEditingCultivateur(null);

  //     await fetchCultivateurs();

  //     alert("Cultivateur ajouté avec succès !");
  //   } catch (err) {
  //     console.error("Erreur lors de l'ajout :", err);

  //     setFormError(
  //       err.response?.data?.message ||
  //         "Impossible d'ajouter le cultivateur. Vérifiez les informations."
  //     );
  //   } finally {
  //     setSaving(false);
  //   }
  // };

const handleSubmit = async (e) => {
  e.preventDefault();
  setFormError("");

  try {
    setSaving(true);

    const dataToSend = {
      ...formData,
      dateNaissance: formData.dateNaissance || null,
      cin: formData.cin.trim() || null,
    };

    if (editingCultivateur) {
      // Modification d'un cultivateur existant
      await api.put(
        `/cultivateurs/${editingCultivateur._id}`,
        dataToSend
      );
    } else {
      // Création d'un nouveau cultivateur
      await api.post("/cultivateurs", dataToSend);
    }

    setShowForm(false);
    setFormData(initialForm);
    setEditingCultivateur(null);

    await fetchCultivateurs();

    alert(
      editingCultivateur
        ? "Cultivateur modifié avec succès !"
        : "Cultivateur ajouté avec succès !"
    );
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err);

    setFormError(
      err.response?.data?.message ||
        "Impossible d'enregistrer le cultivateur. Vérifiez les informations."
    );
  } finally {
    setSaving(false);
  }
};


  // Recherche
  const filteredCultivateurs = cultivateurs.filter((cultivateur) => {
    const fullName =
      `${cultivateur.nom} ${cultivateur.prenom}`.toLowerCase();

    const telephone = cultivateur.telephone || "";

    return (
      fullName.includes(search.toLowerCase()) ||
      telephone.includes(search)
    );
  });

  // Ouvrir le formulaire en mode modification
const handleEdit = (cultivateur) => {
  setEditingCultivateur(cultivateur);

  setFormData({
    nom: cultivateur.nom || "",
    prenom: cultivateur.prenom || "",
    telephone: cultivateur.telephone || "",
    adresse: cultivateur.adresse || "",
    sexe: cultivateur.sexe || "",
    dateNaissance: cultivateur.dateNaissance
      ? cultivateur.dateNaissance.slice(0, 10)
      : "",
    cin: cultivateur.cin || "",
    statut: cultivateur.statut || "Actif",
  });

  setFormError("");
  setShowForm(true);
};

  return (
    <section className="cultivateurs-page">
      <div className="cultivateurs-heading">
        <div>
          <h2>Gestion des cultivateurs</h2>
          <p>
            Consultez et gérez les membres de votre exploitation agricole.
          </p>
        </div>

        <button
          className="add-cultivateur-button"
          onClick={openForm}
        >
          <Plus size={17} />
          Nouveau cultivateur
        </button>
      </div>

      <div className="cultivateurs-summary">
        <div className="cultivateurs-summary-icon">
          <Users size={23} />
        </div>

        <div>
          <span>Total des cultivateurs</span>
          <strong>{cultivateurs.length}</strong>
        </div>
      </div>

      <div className="cultivateurs-table-panel">
        <div className="cultivateurs-toolbar">
          <div>
            <h3>Liste des cultivateurs</h3>
            <p>{filteredCultivateurs.length} résultat(s)</p>
          </div>

          <div className="cultivateurs-actions">
            <div className="cultivateurs-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Rechercher un cultivateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              className="refresh-button"
              onClick={fetchCultivateurs}
              title="Actualiser"
            >
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="cultivateurs-message">
            Chargement des cultivateurs...
          </div>
        ) : error ? (
          <div className="cultivateurs-error">
            {error}
            <button onClick={fetchCultivateurs}>Réessayer</button>
          </div>
        ) : filteredCultivateurs.length === 0 ? (
          <div className="cultivateurs-message">
            Aucun cultivateur trouvé.
          </div>
        ) : (
          <div className="cultivateurs-table-wrapper">
            <table className="cultivateurs-table">
              <thead>
                <tr>
                  <th>Nom complet</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  <th>Sexe</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCultivateurs.map((cultivateur) => (
                  <tr key={cultivateur._id}>
                    <td>
                      <strong>
                        {cultivateur.nom} {cultivateur.prenom}
                      </strong>
                    </td>

                    <td>{cultivateur.telephone}</td>
                    <td>{cultivateur.adresse}</td>
                    <td>{cultivateur.sexe}</td>

                    <td>
                      <span
                        className={`cultivateur-status ${
                          cultivateur.statut === "Actif"
                            ? "is-active"
                            : "is-inactive"
                        }`}
                      >
                        {cultivateur.statut}
                      </span>
                    </td>

                    <td>
                      <div className="cultivateur-row-actions">
                        <button title="Consulter">
                          <Eye size={16} />
                        </button>

                        {/* <button title="Modifier">
                          <Pencil size={16} />
                        </button> */}
                      <button
                          title="Modifier"
                          onClick={() => handleEdit(cultivateur)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          title="Supprimer"
                          className="delete-action"
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

      {/* Fenêtre du formulaire d'ajout */}
      {showForm && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) closeForm();
          }}
          style={styles.overlay}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="form-title"
            style={styles.modal}
          >
            <div style={styles.modalHeader}>
              <div>
                {/* <h2 id="form-title" style={styles.modalTitle}>
                  Nouveau cultivateur
                </h2> */}
                <h2 id="form-title" style={styles.modalTitle}>
                  {editingCultivateur
                    ? "Modifier le cultivateur"
                    : "Nouveau cultivateur"}
                </h2>

                <p style={styles.modalDescription}>
                  Renseignez les informations du cultivateur.
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
                  <label htmlFor="nom">Nom *</label>
                  <input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ex : Rakoto"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="prenom">Prénom *</label>
                  <input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Ex : Jean"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="telephone">Téléphone *</label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="Ex : 0341234567"
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="cin">Numéro CIN</label>
                  <input
                    id="cin"
                    name="cin"
                    value={formData.cin}
                    onChange={handleChange}
                    placeholder="Numéro CIN"
                    style={styles.input}
                  />
                </div>

                <div style={styles.field}>
                  <label htmlFor="sexe">Sexe *</label>
                  <select
                    id="sexe"
                    name="sexe"
                    value={formData.sexe}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </select>
                </div>

                <div style={styles.field}>
                  <label htmlFor="dateNaissance">
                    Date de naissance
                  </label>
                  <input
                    id="dateNaissance"
                    name="dateNaissance"
                    type="date"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>

                <div style={styles.fieldFull}>
                  <label htmlFor="adresse">Adresse *</label>
                  <input
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    placeholder="Ex : Antananarivo"
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
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
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
                : editingCultivateur
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

export default Cultivateurs;
