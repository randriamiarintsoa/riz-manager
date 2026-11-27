
import { useState } from "react";

import {
  LayoutDashboard,
  Users,
  Sprout,
  Wheat,
  ShoppingCart,
  Settings,
  Search,
  Bell,
  Menu,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MapPin,
  CalendarDays,
  Leaf,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./App.css";
import Cultivateurs from "./pages/Cultivateurs";
import Parcelles from "./pages/Parcelles";
import Campagnes from "./pages/Campagnes";

// const navigation = [
//   { label: "Tableau de bord", icon: LayoutDashboard },
//   { label: "Cultivateurs", icon: Users },
//   { label: "Parcelles", icon: Sprout },
//   { label: "Récoltes", icon: Wheat },
//   { label: "Ventes", icon: ShoppingCart },
// ];
const navigation = [
  { label: "Tableau de bord", icon: LayoutDashboard },
  { label: "Cultivateurs", icon: Users },
  { label: "Parcelles", icon: Sprout },
  { label: "Campagnes", icon: CalendarDays },
  { label: "Récoltes", icon: Wheat },
  { label: "Ventes", icon: ShoppingCart },
];

const harvestData = [
  { month: "Jan", quantity: 120 },
  { month: "Fév", quantity: 180 },
  { month: "Mar", quantity: 150 },
  { month: "Avr", quantity: 240 },
  { month: "Mai", quantity: 210 },
  { month: "Juin", quantity: 320 },
  { month: "Juil", quantity: 280 },
  { month: "Août", quantity: 390 },
  { month: "Sep", quantity: 350 },
  { month: "Oct", quantity: 460 },
  { month: "Nov", quantity: 420 },
  { month: "Déc", quantity: 520 },
];

const recentActivities = [
  {
    name: "Rakoto Jean",
    action: "Nouvelle récolte enregistrée",
    date: "Aujourd'hui, 09:30",
    status: "Validée",
    quantity: "1 250 kg",
  },
  {
    name: "Rasoa Marie",
    action: "Inscription d'un cultivateur",
    date: "Aujourd'hui, 08:15",
    status: "Actif",
    quantity: "—",
  },
  {
    name: "Randria Paul",
    action: "Vente de riz enregistrée",
    date: "Hier, 15:45",
    status: "Terminée",
    quantity: "850 kg",
  },
  {
    name: "Rabe Solo",
    action: "Mise à jour d'une parcelle",
    date: "Hier, 11:20",
    status: "Validée",
    quantity: "2,5 ha",
  },
];

function App() {
  const [activePage, setActivePage] = useState("Tableau de bord");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: "Cultivateurs",
      value: "248",
      change: "+12,5%",
      description: "vs mois dernier",
      icon: Users,
      color: "green",
      trend: "up",
    },
    {
      title: "Parcelles",
      value: "156",
      change: "+8,2%",
      description: "vs mois dernier",
      icon: Sprout,
      color: "blue",
      trend: "up",
    },
    {
      title: "Récoltes totales",
      value: "24 850",
      unit: "kg",
      change: "+18,4%",
      description: "vs mois dernier",
      icon: Wheat,
      color: "orange",
      trend: "up",
    },
    {
      title: "Ventes réalisées",
      value: "18,5 M",
      unit: "Ar",
      change: "-2,4%",
      description: "vs mois dernier",
      icon: ShoppingCart,
      color: "purple",
      trend: "down",
    },
  ];

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Leaf size={25} />
          </div>

          <div>
            <h2>RizManager</h2>
            <span>Gestion agricole</span>
          </div>
        </div>

        <div className="menu-label">MENU PRINCIPAL</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className={`nav-item ${
                  activePage === item.label ? "active" : ""
                }`}
                onClick={() => {
                  setActivePage(item.label);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <Leaf size={20} />
            </div>

            <h4>RizManager</h4>
            <p>Suivez et optimisez votre activité agricole.</p>
          </div>

          <button className="nav-item settings-item">
            <Settings size={19} />
            <span>Paramètres</span>
          </button>

          <div className="profile">
            <div className="avatar">NR</div>

            <div className="profile-info">
              <strong>Administrateur</strong>
              <span>Gestionnaire</span>
            </div>

            <button
              className="profile-more"
              aria-label="Options du profil"
            >
              •••
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <div className="breadcrumb">
                RizManager / {activePage}
              </div>
              <h1>{activePage}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Rechercher..." />
              <kbd>⌘ K</kbd>
            </div>

            <button
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span />
            </button>

            <div className="topbar-avatar">NR</div>
          </div>
        </header>

        {/* CONTENU SELON LA PAGE ACTIVE */}
        
          <div className="dashboard-content">
          {activePage === "Cultivateurs" ? (
            <Cultivateurs />
          ) : activePage === "Parcelles" ? (
            <Parcelles />
          ) : activePage === "Campagnes" ? (
            <Campagnes />
          ) : activePage === "Tableau de bord" ? (
            <>
              {/* BIENVENUE */}
              <section className="welcome-section">
                <div>
                  <h2>Bonjour, Administrateur 👋</h2>
                  <p>
                    Voici un aperçu de votre activité agricole aujourd'hui.
                  </p>
                </div>

                <div className="date-display">
                  <CalendarDays size={17} />
                  <span>
                    {new Date().toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </section>

              {/* STATISTIQUES */}
              <section className="stats-grid">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <article className="stat-card" key={stat.title}>
                      <div className="stat-card-top">
                        <div className={`stat-icon ${stat.color}`}>
                          <Icon size={21} />
                        </div>

                        <span
                          className={`stat-change ${
                            stat.trend === "down" ? "negative" : ""
                          }`}
                        >
                          {stat.trend === "up" ? (
                            <TrendingUp size={14} />
                          ) : (
                            <TrendingDown size={14} />
                          )}

                          {stat.change}
                        </span>
                      </div>

                      <p className="stat-title">{stat.title}</p>

                      <div className="stat-value">
                        {stat.value}
                        {stat.unit && <span> {stat.unit}</span>}
                      </div>

                      <p className="stat-description">
                        {stat.description}
                      </p>
                    </article>
                  );
                })}
              </section>

              {/* GRAPHIQUE ET PRODUCTION */}
              <section className="dashboard-grid">
                <article className="panel harvest-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Évolution des récoltes</h3>
                      <p>Production annuelle en kilogrammes</p>
                    </div>

                    <select
                      defaultValue="2026"
                      className="period-select"
                    >
                      <option value="2026">Année 2026</option>
                      <option value="2025">Année 2025</option>
                    </select>
                  </div>

                  <div className="chart-summary">
                    <strong>24 850 kg</strong>

                    <span className="chart-growth">
                      <TrendingUp size={15} />
                      +18,4%
                    </span>
                  </div>

                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={harvestData}
                        margin={{
                          top: 15,
                          right: 10,
                          left: -15,
                          bottom: 0,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="harvestGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#269b61"
                              stopOpacity={0.22}
                            />
                            <stop
                              offset="100%"
                              stopColor="#269b61"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          strokeDasharray="4 4"
                          vertical={false}
                          stroke="#edf0ed"
                        />

                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#929a94", fontSize: 12 }}
                          dy={10}
                        />

                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#929a94", fontSize: 12 }}
                        />

                        <Tooltip
                          formatter={(value) => [
                            `${value} kg`,
                            "Récolte",
                          ]}
                          contentStyle={{
                            borderRadius: "10px",
                            border: "1px solid #e8eee9",
                          }}
                        />

                        <Area
                          type="monotone"
                          dataKey="quantity"
                          stroke="#269b61"
                          strokeWidth={2.5}
                          fill="url(#harvestGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </article>

                <article className="panel production-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Production agricole</h3>
                      <p>État général des activités</p>
                    </div>

                    <button className="more-button">•••</button>
                  </div>

                  <div className="production-illustration">
                    <div className="production-circle">
                      <Wheat size={44} />
                    </div>
                  </div>

                  <div className="production-total">
                    <strong>24 850 kg</strong>
                    <span>Production totale</span>
                  </div>

                  <div className="production-progress">
                    <div className="progress-label">
                      <span>Objectif annuel</span>
                      <strong>72%</strong>
                    </div>

                    <div className="progress-track">
                      <div className="progress-fill" />
                    </div>

                    <p>Objectif : 35 000 kg</p>
                  </div>
                </article>
              </section>

              {/* ACTIVITÉS RÉCENTES */}
              <section className="panel activities-panel">
                <div className="panel-header activities-header">
                  <div>
                    <h3>Activités récentes</h3>
                    <p>Les dernières opérations enregistrées</p>
                  </div>

                  <button className="view-all">
                    Voir tout <ArrowUpRight size={16} />
                  </button>
                </div>

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Activité</th>
                        <th>Date</th>
                        <th>Quantité</th>
                        <th>Statut</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentActivities.map((activity, index) => (
                        <tr key={index}>
                          <td>
                            <div className="table-user">
                              <div
                                className={`table-avatar avatar-${index}`}
                              >
                                {activity.name
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")}
                              </div>

                              <strong>{activity.name}</strong>
                            </div>
                          </td>

                          <td>{activity.action}</td>
                          <td>{activity.date}</td>

                          <td className="quantity-cell">
                            {activity.quantity}
                          </td>

                          <td>
                            <span className={`status status-${index}`}>
                              {activity.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* PIED DE PAGE */}
              <footer className="footer">
                <span>
                  © 2026 RizManager. Tous droits réservés.
                </span>

                <span>
                  <MapPin size={14} /> Gestion agricole
                </span>
              </footer>
            </>
          ) : (
            <section className="panel">
              <h3>{activePage}</h3>
              <p>
                Cette page sera développée prochainement.
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
