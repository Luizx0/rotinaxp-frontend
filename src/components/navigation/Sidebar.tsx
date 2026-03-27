import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import { NavLink } from "react-router-dom";
import { sidebarMenuItems } from "../../routes/paths";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate: () => void;
}

function getMenuIcon(iconKey: string) {
  switch (iconKey) {
    case "dashboard":
      return <DashboardOutlinedIcon fontSize="small" />;
    case "tasks":
      return <TaskAltOutlinedIcon fontSize="small" />;
    case "rewards":
      return <CardGiftcardOutlinedIcon fontSize="small" />;
    case "progress":
      return <TimelineOutlinedIcon fontSize="small" />;
    case "profile":
      return <AccountCircleOutlinedIcon fontSize="small" />;
    default:
      return <DashboardOutlinedIcon fontSize="small" />;
  }
}

function Sidebar({ isOpen, isCollapsed, onToggleCollapse, onNavigate }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""} ${isCollapsed ? "sidebar--collapsed" : ""}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">
          <AutoAwesomeOutlinedIcon fontSize="small" />
        </div>
        {!isCollapsed ? (
          <div>
            <strong>RotinaXP</strong>
            <p>Sistema pessoal de foco</p>
          </div>
        ) : null}
      </div>

      <div className="sidebar__collapse">
        <button type="button" className="icon-button" onClick={onToggleCollapse} aria-label="Expandir ou recolher sidebar">
          {isCollapsed ? <ChevronRightOutlinedIcon fontSize="small" /> : <ChevronLeftOutlinedIcon fontSize="small" />}
        </button>
      </div>

      <nav className="sidebar__nav tour-sidebar-nav" aria-label="Navegacao principal">
        {sidebarMenuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
            onClick={onNavigate}
          >
            <span className="sidebar__link-icon">{getMenuIcon(item.icon)}</span>
            {!isCollapsed ? <span>{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>

      {!isCollapsed ? (
        <div className="sidebar__footer">
          <p>Seu mapa visual para tarefas, pontos, recompensas e progresso.</p>
        </div>
      ) : null}
    </aside>
  );
}

export default Sidebar;
