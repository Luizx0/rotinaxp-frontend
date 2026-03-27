import { motion } from "framer-motion";
import { useState } from "react";
import AlertBanner from "../../components/common/AlertBanner";
import PointsAreaChart from "../../components/charts/PointsAreaChart";
import { fadeInUp, staggerContainer } from "../../components/common/motion";
import PageTabs from "../../components/common/PageTabs";
import { useAppData } from "../../hooks/useAppData";

function ProgressPage() {
  const { progress, tasks, isLoading, error } = useAppData();
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
      <motion.div className="page-hero" variants={fadeInUp} initial="hidden" animate="show">
        <div>
          <p className="section-eyebrow">Historico</p>
          <h2>Progresso</h2>
          <p>Leitura de tendencia para pontos e entregas realizadas ao longo do tempo.</p>
        </div>
      </motion.div>

      {isLoading ? <p className="form-hint">Carregando progresso...</p> : null}
      {error ? <AlertBanner message={error} /> : null}

      <PageTabs
        tabs={[
          { key: "week", label: "Semana" },
          { key: "month", label: "Mes" },
        ]}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      <motion.div className="dashboard-grid dashboard-grid--two-columns" variants={staggerContainer} initial="hidden" animate="show">
        <motion.div className="tour-progress-chart" variants={fadeInUp}>
          <PointsAreaChart data={chartData} />
        </motion.div>

        <motion.article className="panel-card" variants={fadeInUp}>
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">Timeline</p>
              <h3>Ultimas entregas</h3>
            </div>
          </div>
          <div className="timeline-list">
            {completedTasks.length === 0 ? (
              <div className="timeline-item">
                <strong>Sem eventos ainda</strong>
                <p>Conclua tarefas para construir seu histórico de progresso.</p>
                <span>0 XP</span>
              </div>
            ) : null}
            {completedTasks.map((task) => (
              <div key={task.id} className="timeline-item">
                <strong>{task.title}</strong>
                <p>{task.category}</p>
                <span>{task.points} XP</span>
              </div>
            ))}
          </div>
        </motion.article>
      </motion.div>
    </section>
  );
}

export default ProgressPage;
