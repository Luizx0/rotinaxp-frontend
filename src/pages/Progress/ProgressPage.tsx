import { useState } from "react";
import PointsAreaChart from "../../components/charts/PointsAreaChart";
import PageTabs from "../../components/common/PageTabs";
import { useAppData } from "../../hooks/useAppData";

function ProgressPage() {
  const { progress, tasks } = useAppData();
  const [activeTab, setActiveTab] = useState("week");

  const chartData =
    activeTab === "week"
      ? progress
      : progress.map((item, index) => ({
          label: `S${index + 1}`,
          points: item.points + index * 10,
          tasks: item.tasks,
        }));

  const completedTasks = [...tasks]
    .filter((task) => task.completed)
    .sort((leftTask, rightTask) => rightTask.createdAt.localeCompare(leftTask.createdAt))
    .slice(0, 5);

  return (
    <section className="page-stack">
      <div className="page-hero">
        <div>
          <p className="section-eyebrow">Historico</p>
          <h2>Progresso</h2>
          <p>Leitura de tendencia para pontos e entregas realizadas ao longo do tempo.</p>
        </div>
      </div>

      <PageTabs
        tabs={[
          { key: "week", label: "Semana" },
          { key: "month", label: "Mes" },
        ]}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      <div className="dashboard-grid dashboard-grid--two-columns">
        <PointsAreaChart data={chartData} />

        <article className="panel-card">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">Timeline</p>
              <h3>Ultimas entregas</h3>
            </div>
          </div>
          <div className="timeline-list">
            {completedTasks.map((task) => (
              <div key={task.id} className="timeline-item">
                <strong>{task.title}</strong>
                <p>{task.category}</p>
                <span>{task.points} XP</span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default ProgressPage;
