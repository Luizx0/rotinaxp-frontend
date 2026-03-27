import { useState } from "react";
import CompletionChart from "../../components/charts/CompletionChart";
import PointsAreaChart from "../../components/charts/PointsAreaChart";
import AlertBanner from "../../components/common/AlertBanner";
import OnboardingGuide from "../../components/common/OnboardingGuide";
import PageTabs from "../../components/common/PageTabs";
import StatCard from "../../components/common/StatCard";
import { useAppData } from "../../hooks/useAppData";
import { useAuth } from "../../hooks/useAuth";

function DashboardPage() {
  const { session } = useAuth();
  const { tasks, rewards, progress, isLoading, error, isOnboardingVisible, dismissOnboarding } = useAppData();
  const [activeTab, setActiveTab] = useState("overview");

  const completedTasks = tasks.filter((task) => task.completed).length;
  const openTasks = tasks.length - completedTasks;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const availableRewards = rewards.filter((reward) => !reward.claimed).length;
  const topTasks = [...tasks].filter((task) => !task.completed).slice(0, 3);

  return (
    <section className="page-stack">
      <div className="page-hero">
        <div>
          <p className="section-eyebrow">Resumo</p>
          <h2>Ola, {session?.user.name.split(" ")[0]}</h2>
          <p>Seu painel concentra pontos, ritmo da semana, tarefas prioritarias e o que ainda falta para bater a meta.</p>
        </div>

        <div className="hero-highlight">
          <span>Meta diaria</span>
          <strong>{session?.user.dailyGoal} XP</strong>
          <p>Faltam {Math.max(0, (session?.user.dailyGoal ?? 0) - (progress.at(-1)?.points ?? 0))} XP para fechar o dia.</p>
        </div>
      </div>

      <PageTabs
        tabs={[
          { key: "overview", label: "Visao geral" },
          { key: "goals", label: "Metas" },
          { key: "insights", label: "Insights" },
        ]}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      <div className="stats-grid">
        <StatCard label="Pontos acumulados" value={`${session?.user.points ?? 0} XP`} helper="Saldo atual da jornada" tone="primary" />
        <StatCard label="Tarefas concluidas" value={`${completedTasks}`} helper="Entregas finalizadas" tone="success" />
        <StatCard label="Tarefas em aberto" value={`${openTasks}`} helper="Acoes pendentes" tone="warning" />
        <StatCard label="Recompensas ativas" value={`${availableRewards}`} helper="Itens disponiveis para troca" tone="neutral" />
      </div>

      {isLoading ? <p className="form-hint">Atualizando indicadores...</p> : null}
      {error ? <AlertBanner message={error} /> : null}
      {isOnboardingVisible ? <OnboardingGuide onDismiss={dismissOnboarding} /> : null}

      {activeTab === "overview" ? (
        <div className="dashboard-grid">
          <PointsAreaChart data={progress} />
          <CompletionChart completed={completedTasks} open={openTasks} />

          <article className="panel-card">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Foco</p>
                <h3>Proximas entregas</h3>
              </div>
            </div>
            <div className="stack-list">
              {topTasks.length === 0 ? (
                <div className="mini-card">
                  <strong>Nenhuma tarefa criada</strong>
                  <p>Use a tela de tarefas para começar a montar sua rotina.</p>
                </div>
              ) : null}
              {topTasks.map((task) => (
                <div key={task.id} className="mini-card">
                  <strong>{task.title}</strong>
                  <span>{task.category}</span>
                  <p>{task.points} XP disponiveis</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel-card">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Cadencia</p>
                <h3>Leitura rapida</h3>
              </div>
            </div>
            <div className="stack-list">
              <div className="mini-card">
                <strong>{completionRate}%</strong>
                <p>da sua base de tarefas ja foi concluida.</p>
              </div>
              <div className="mini-card">
                <strong>{session?.user.streak} dias</strong>
                <p>de consistencia acumulada no ritmo atual.</p>
              </div>
              <div className="mini-card">
                <strong>Nivel {session?.user.level}</strong>
                <p>destravado automaticamente pela evolucao de pontos.</p>
              </div>
            </div>
          </article>
        </div>
      ) : null}

      {activeTab === "goals" ? (
        <div className="dashboard-grid dashboard-grid--two-columns">
          <article className="panel-card">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Metas</p>
                <h3>Objetivos do ciclo</h3>
              </div>
            </div>
            <div className="stack-list">
              <div className="goal-row">
                <span>Pontos diarios</span>
                <strong>{session?.user.dailyGoal} XP</strong>
              </div>
              <div className="goal-row">
                <span>Conclusao media</span>
                <strong>{completionRate}%</strong>
              </div>
              <div className="goal-row">
                <span>Streak atual</span>
                <strong>{session?.user.streak} dias</strong>
              </div>
            </div>
          </article>

          <article className="panel-card">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Planejamento</p>
                <h3>Sugestao de foco</h3>
              </div>
            </div>
            <p className="text-muted">Priorize uma tarefa de alta prioridade, uma tarefa curta e uma tarefa de manutencao para distribuir energia ao longo do dia.</p>
          </article>
        </div>
      ) : null}

      {activeTab === "insights" ? (
        <div className="dashboard-grid dashboard-grid--two-columns">
          <article className="panel-card">
            <div className="section-heading">
              <div>
                <p className="section-eyebrow">Insights</p>
                <h3>Leituras automaticas</h3>
              </div>
            </div>
            <div className="stack-list">
              <div className="mini-card">
                <strong>{progress.at(-1)?.points ?? 0} XP hoje</strong>
                <p>{completedTasks === 0 ? "Seu progresso vai aparecer quando concluir a primeira tarefa." : "Seu ritmo mais recente ficou acima do inicio da semana."}</p>
              </div>
              <div className="mini-card">
                <strong>{availableRewards} recompensas abertas</strong>
                <p>Ja existe saldo para trocar ao menos uma delas.</p>
              </div>
            </div>
          </article>

          <article className="panel-card gradient-panel">
            <p className="section-eyebrow">Proximo passo</p>
            <h3>Conecte autenticacao real e persistencia no backend</h3>
            <p>O frontend ja esta separado por contexto, hooks, servicos e rotas protegidas. O encaixe com JWT e endpoints adicionais fica direto.</p>
          </article>
        </div>
      ) : null}
    </section>
  );
}

export default DashboardPage;
