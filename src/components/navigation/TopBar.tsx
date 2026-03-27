import BedtimeOutlinedIcon from "@mui/icons-material/BedtimeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useThemeMode } from "../../hooks/useThemeMode";
import { topBarTitleMap } from "../../routes/paths";

interface TopBarProps {
  onToggleSidebar: () => void;
  onToggleSidebarCollapse: () => void;
  isSidebarCollapsed: boolean;
}

function TopBar({ onToggleSidebar, onToggleSidebarCollapse, isSidebarCollapsed }: TopBarProps) {
  const { pathname } = useLocation();
  const { session, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const currentTitle = topBarTitleMap[pathname] ?? "RotinaXP";

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button type="button" className="topbar__menu-button" onClick={onToggleSidebar}>
          Menu
        </button>
        <button type="button" className="topbar__desktop-menu" onClick={onToggleSidebarCollapse} aria-label="Expandir ou recolher menu lateral">
          {isSidebarCollapsed ? <MenuOutlinedIcon fontSize="small" /> : <MenuOpenOutlinedIcon fontSize="small" />}
        </button>
        <div>
          <p className="section-eyebrow">Workspace</p>
          <h1>{currentTitle}</h1>
        </div>
      </div>

      <div className="topbar__right">
        <div className="topbar__points">
          <StarsOutlinedIcon fontSize="small" />
          <span>Pontos</span>
          <strong>{session?.user.points ?? 0}</strong>
        </div>

        <button type="button" className="icon-button" onClick={toggleMode} aria-label="Alternar tema claro e escuro">
          {mode === "light" ? <BedtimeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
        </button>

        <div className="topbar__user">
          <div className="topbar__avatar">
            <PersonOutlineOutlinedIcon fontSize="small" />
          </div>
          <div>
            <strong>{session?.user.name}</strong>
            <p>{session?.user.role}</p>
          </div>
        </div>
        <button type="button" className="secondary-button" onClick={logout}>
          Sair
        </button>
      </div>
    </header>
  );
}

export default TopBar;
