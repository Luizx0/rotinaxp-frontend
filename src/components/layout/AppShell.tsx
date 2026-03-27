import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../navigation/Sidebar";
import TopBar from "../navigation/TopBar";

function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar isOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />
      {isSidebarOpen ? <button type="button" className="app-shell__overlay" onClick={() => setIsSidebarOpen(false)} /> : null}
      <div className="app-shell__main">
        <TopBar onToggleSidebar={() => setIsSidebarOpen((currentState) => !currentState)} />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
