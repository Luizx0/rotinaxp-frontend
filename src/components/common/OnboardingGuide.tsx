interface OnboardingGuideProps {
  onDismiss: () => void;
}

function OnboardingGuide({ onDismiss }: OnboardingGuideProps) {
  return (
    <article className="panel-card onboarding-guide">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">Primeiros passos</p>
          <h3>Bem-vindo ao RotinaXP</h3>
        </div>
        <button type="button" className="secondary-button" onClick={onDismiss}>
          Entendi
        </button>
      </div>

      <div className="onboarding-guide__grid">
        <div className="mini-card">
          <strong>1. Crie tarefas</strong>
          <p>Comece na aba de tarefas criando itens curtos com pontos coerentes.</p>
        </div>
        <div className="mini-card">
          <strong>2. Marque conclusoes</strong>
          <p>Quando concluir uma tarefa, os pontos entram no seu saldo automaticamente.</p>
        </div>
        <div className="mini-card">
          <strong>3. Monte sua loja</strong>
          <p>Na tela de recompensas, cadastre seus prêmios e defina o custo em XP.</p>
        </div>
        <div className="mini-card">
          <strong>4. Acompanhe o progresso</strong>
          <p>Com tarefas concluídas, os gráficos do dashboard e da página de progresso serão alimentados.</p>
        </div>
      </div>
    </article>
  );
}

export default OnboardingGuide;
