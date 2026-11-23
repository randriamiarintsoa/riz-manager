
import { useEffect, useState } from "react";
import { Search, Plus, Users, RefreshCw, Eye, Pencil, Trash2 } from "lucide-react";
import api from "../services/api";
import "./Cultivateurs.css";

function Cultivateurs() {
  const [cultivateurs, setCultivateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

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

  const filteredCultivateurs = cultivateurs.filter((cultivateur) => {
    const fullName = `${cultivateur.nom} ${cultivateur.prenom}`.toLowerCase();
    const telephone = cultivateur.telephone || "";

    return (
      fullName.includes(search.toLowerCase()) ||
      telephone.includes(search)
    );
  });

  return (
    <section className="cultivateurs-page">
      <div className="cultivateurs-heading">
        <div>
          <h2>Gestion des cultivateurs</h2>
          <p>Consultez et gérez les membres de votre exploitation agricole.</p>
        </div>

        <button className="add-cultivateur-button">
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
                        <button title="Modifier">
                          <Pencil size={16} />
                        </button>
                        <button title="Supprimer" className="delete-action">
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
    </section>
  );
}

export default Cultivateurs;
