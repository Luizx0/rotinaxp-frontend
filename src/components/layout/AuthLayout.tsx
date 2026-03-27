import { PropsWithChildren, ReactNode } from "react";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  footer: ReactNode;
}

function AuthLayout({ eyebrow, title, description, footer, children }: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className="auth-layout">
      <section className="auth-layout__hero">
        <span className="hero-badge">RotinaXP</span>
        <p className="section-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>

        <div className="hero-metrics">
          <article>
            <strong>+24%</strong>
            <span>mais consistencia semanal</span>
          </article>
          <article>
            <strong>7 blocos</strong>
            <span>visao clara do progresso</span>
          </article>
          <article>
            <strong>100%</strong>
            <span>estrutura pronta para evoluir com API</span>
          </article>
        </div>
      </section>

      <section className="auth-layout__panel">
        <div className="auth-layout__card">{children}</div>
        <div className="auth-layout__footer">{footer}</div>
      </section>
    </div>
  );
}

export default AuthLayout;
