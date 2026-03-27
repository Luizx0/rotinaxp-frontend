import { Link } from "react-router-dom";
import { appPaths } from "../../routes/paths";

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-page__hero">
        <div className="home-page__glow" aria-hidden="true" />

        <header className="home-page__topbar">
          <div className="home-page__brand">
            <span className="home-page__logo">RX</span>
            <strong>RotinaXP</strong>
          </div>

          <nav className="home-page__actions" aria-label="Acesso rapido">
            <Link className="secondary-button" to={appPaths.login}>
              Entrar
            </Link>
            <Link className="primary-button" to={appPaths.register}>
              Criar conta
            </Link>
          </nav>
        </header>

        <div className="home-page__content">
          <p className="section-eyebrow">Planejar. Executar. Evoluir.</p>
          <h1>Uma homepage pensada para converter foco em progresso real.</h1>
          <p>
            Organize tarefas, acompanhe pontos, desbloqueie recompensas e mantenha sua rotina conectada em um unico painel.
          </p>

          <div className="home-page__cta">
            <Link className="primary-button" to={appPaths.register}>
              Comecar agora
            </Link>
            <Link className="secondary-button" to={appPaths.login}>
              Ja tenho conta
            </Link>
          </div>
        </div>

        <div className="home-page__stats">
          <article>
            <strong>+120 XP</strong>
            <span>meta semanal media</span>
          </article>
          <article>
            <strong>5 modulos</strong>
            <span>dashboard, tarefas, recompensas, progresso e perfil</span>
          </article>
          <article>
            <strong>100%</strong>
            <span>fluxo interconectado com regras de erro</span>
          </article>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
