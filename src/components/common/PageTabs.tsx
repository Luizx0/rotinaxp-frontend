import { TabItem } from "../../types/app";

interface PageTabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

function PageTabs({ tabs, activeKey, onChange }: PageTabsProps) {
  return (
    <div className="page-tabs" role="tablist" aria-label="Navegacao interna da pagina">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={tab.key === activeKey}
          className={`page-tabs__item ${tab.key === activeKey ? "page-tabs__item--active" : ""}`}
          onClick={() => onChange(tab.key)}
        >
          <span>{tab.label}</span>
          {typeof tab.count === "number" ? <strong>{tab.count}</strong> : null}
        </button>
      ))}
    </div>
  );
}

export default PageTabs;
