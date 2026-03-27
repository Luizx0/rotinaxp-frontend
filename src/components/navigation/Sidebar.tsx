import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
}

const menuItems = [
  { label: "Dashboard", to: "/dashboard", code: "DB" },
  { label: "Tarefas", to: "/tasks", code: "TK" },
  { label: "Recompensas", to: "/rewards", code: "RW" },
  { label: "Progresso", to: "/progress", code: "PG" },
  { label: "Perfil", to: "/profile", code: "PF" },
];

function Sidebar({ isOpen, onNavigate }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">RX</div>
        <div>
          <strong>RotinaXP</strong>
          <p>Sistema pessoal de foco</p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Navegacao principal">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
            onClick={onNavigate}
          >
            <span className="sidebar__link-icon">{item.code}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <p>Seu mapa visual para tarefas, pontos, recompensas e progresso.</p>
      </div>
    </aside>
  );
}

export default Sidebar;
