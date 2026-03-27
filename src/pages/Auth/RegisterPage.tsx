import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AlertBanner from "../../components/common/AlertBanner";
import AuthLayout from "../../components/layout/AuthLayout";
import { useAuth } from "../../hooks/useAuth";
import { appPaths } from "../../routes/paths";
import { getErrorMessage } from "../../services/errorService";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas nao conferem.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ name, email, password });
      navigate(appPaths.dashboard);
    } catch (currentError) {
      setError(getErrorMessage(currentError, "Nao foi possivel criar a conta."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Onboarding"
      title="Monte a sua rotina com uma base pronta para escalar"
      description="Cadastro com estado global, layout responsivo e navegacao protegida para evoluir com autenticacao real depois."
      footer={
        <p>
          Ja tem conta? <Link to={appPaths.login}>Voltar para login</Link> · <Link to={appPaths.root}>Voltar para homepage</Link>
        </p>
      }
    >
      <div className="auth-copy">
        <p className="section-eyebrow">Novo usuario</p>
        <h2>Criar conta</h2>
        <p>Comece com metas diarias, acompanhamento visual e areas separadas por responsabilidade.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          <span>Nome</span>
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>

        <label>
          <span>Senha</span>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>

        <label>
          <span>Confirmar senha</span>
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </label>

        {error ? <AlertBanner message={error} /> : null}

        <button type="submit" className="primary-button primary-button--block" disabled={isSubmitting}>
          {isSubmitting ? "Criando..." : "Criar e entrar"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
