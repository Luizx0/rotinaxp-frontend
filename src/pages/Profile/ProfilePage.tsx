import { FormEvent, useEffect, useState } from "react";
import StatCard from "../../components/common/StatCard";
import { useAppData } from "../../hooks/useAppData";
import { useAuth } from "../../hooks/useAuth";

function ProfilePage() {
  const { session, updateProfile } = useAuth();
  const { tasks, rewards } = useAppData();
  const [name, setName] = useState(session?.user.name ?? "");
  const [email, setEmail] = useState(session?.user.email ?? "");
  const [about, setAbout] = useState(session?.user.about ?? "");
  const [dailyGoal, setDailyGoal] = useState(session?.user.dailyGoal ?? 100);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    setName(session?.user.name ?? "");
    setEmail(session?.user.email ?? "");
    setAbout(session?.user.about ?? "");
    setDailyGoal(session?.user.dailyGoal ?? 100);
  }, [session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateProfile({ name, email, about, dailyGoal });
    setFeedback("Perfil atualizado com sucesso.");
  }

  return (
    <section className="page-stack">
      <div className="page-hero">
        <div>
          <p className="section-eyebrow">Conta</p>
          <h2>Perfil</h2>
          <p>Area de configuracao pessoal para ajustar informacoes da conta, meta diaria e descricao do usuario.</p>
        </div>
      </div>

      <div className="stats-grid stats-grid--compact">
        <StatCard label="Nivel" value={`${session?.user.level ?? 1}`} helper="calculado por faixa de pontos" tone="primary" />
        <StatCard label="Tarefas" value={`${tasks.length}`} helper="volume total cadastrado" tone="success" />
        <StatCard label="Recompensas" value={`${rewards.length}`} helper="catalogo disponivel" tone="neutral" />
      </div>

      <div className="dashboard-grid dashboard-grid--two-columns">
        <form className="panel-card form-panel" onSubmit={handleSubmit}>
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">Edicao</p>
              <h3>Dados principais</h3>
            </div>
          </div>

          <div className="form-grid">
            <label>
              <span>Nome</span>
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              <span>Email</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="form-grid__full">
              <span>Sobre</span>
              <textarea rows={5} value={about} onChange={(event) => setAbout(event.target.value)} />
            </label>
            <label>
              <span>Meta diaria</span>
              <input
                type="number"
                min={50}
                step={10}
                value={dailyGoal}
                onChange={(event) => setDailyGoal(Number(event.target.value) || 50)}
              />
            </label>
          </div>

          {feedback ? <p className="form-success">{feedback}</p> : null}

          <div className="form-actions">
            <button type="submit" className="primary-button">
              Salvar perfil
            </button>
          </div>
        </form>

        <article className="panel-card gradient-panel">
          <p className="section-eyebrow">Identidade</p>
          <h3>{session?.user.name}</h3>
          <p>{session?.user.role}</p>
          <div className="stack-list">
            <div className="mini-card">
              <strong>{session?.user.points} XP</strong>
              <p>saldo atual para investir em recompensas</p>
            </div>
            <div className="mini-card">
              <strong>{session?.user.streak} dias</strong>
              <p>sequencia ativa de execucao</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default ProfilePage;
