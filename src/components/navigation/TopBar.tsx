import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { topBarTitleMap } from "../../routes/paths";

interface TopBarProps {
  onToggleSidebar: () => void;
}

function TopBar({ onToggleSidebar }: TopBarProps) {
  const { pathname } = useLocation();
  const { session, logout } = useAuth();
  const currentTitle = topBarTitleMap[pathname] ?? "RotinaXP";

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button type="button" className="topbar__menu-button" onClick={onToggleSidebar}>
          Menu
        </button>
        <div>
          <p className="section-eyebrow">Workspace</p>
          <h1>{currentTitle}</h1>
        </div>
      </div>

      <div className="topbar__right">
        <div className="topbar__points">
          <span>Pontos</span>
          <strong>{session?.user.points ?? 0}</strong>
        </div>
        <div className="topbar__user">
          <div className="topbar__avatar">{session?.user.name.slice(0, 2).toUpperCase()}</div>
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
