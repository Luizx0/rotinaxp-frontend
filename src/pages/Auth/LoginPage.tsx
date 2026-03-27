import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertBanner from "../../components/common/AlertBanner";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuth } from "../../hooks/useAuth";
import { appPaths } from "../../routes/paths";
import { getErrorMessage } from "../../services/errorService";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("demo@rotinaxp.app");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(appPaths.dashboard);
    } catch (currentError) {
      setError(getErrorMessage(currentError, "Nao foi possivel entrar."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Acesso"
      title="Entre e acompanhe a sua evolucao diaria"
      description="Uma entrada limpa para chegar rapido no painel, consultar metas, concluir tarefas e trocar recompensas."
      footer={
        <p>
          Ainda nao tem conta? <Link to={appPaths.register}>Criar cadastro</Link> · <Link to={appPaths.root}>Voltar para homepage</Link>
        </p>
      }
    >
      <div className="auth-copy">
        <p className="section-eyebrow">Conta demo</p>
        <h2>Entrar</h2>
        <p>Use a conta demo preenchida abaixo ou crie um usuario proprio para navegar pelas telas.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>

        <label>
          <span>Senha</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>

        {error ? <AlertBanner message={error} /> : null}

        <button type="submit" className="primary-button primary-button--block" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Acessar painel"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
