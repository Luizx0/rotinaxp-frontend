import { useState } from "react";
import AlertBanner from "../../components/common/AlertBanner";
import PageTabs from "../../components/common/PageTabs";
import RewardComposer from "../../components/rewards/RewardComposer";
import StatCard from "../../components/common/StatCard";
import { useAppData } from "../../hooks/useAppData";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../services/errorService";
import { RewardDraft } from "../../types/app";

function RewardsPage() {
  const { rewards, redeemReward, addReward, isLoading, error, clearError } = useAppData();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("available");
  const [localError, setLocalError] = useState<string | null>(null);

  const visibleRewards = rewards.filter((reward) => {
    if (activeTab === "claimed") {
      return reward.claimed;
    }

    return !reward.claimed;
  });

  async function handleRedeemReward(rewardId: string) {
    setLocalError(null);
    clearError();

    try {
      await redeemReward(rewardId);
    } catch (currentError) {
      setLocalError(getErrorMessage(currentError, "Nao foi possivel resgatar a recompensa."));
    }
  }

  async function handleCreateReward(draft: RewardDraft) {
    setLocalError(null);
    clearError();

    try {
      await addReward(draft);
      setActiveTab("available");
    } catch (currentError) {
      setLocalError(getErrorMessage(currentError, "Nao foi possivel criar a recompensa."));
    }
  }

  return (
    <section className="page-stack">
      <div className="page-hero">
        <div>
          <p className="section-eyebrow">Trocas</p>
          <h2>Recompensas</h2>
          <p>Central para listar premios, acompanhar saldo e resgatar itens desbloqueados com os pontos acumulados.</p>
        </div>
        <div className="hero-highlight">
          <span>Saldo disponivel</span>
          <strong>{session?.user.points ?? 0} XP</strong>
          <p>Use os pontos ganhos nas tarefas para resgatar motivadores.</p>
        </div>
      </div>

      {isLoading ? <p className="form-hint">Carregando recompensas...</p> : null}
      {error ? <AlertBanner message={error} /> : null}
      {localError ? <AlertBanner message={localError} /> : null}

      <PageTabs
        tabs={[
          { key: "available", label: "Disponiveis", count: rewards.filter((reward) => !reward.claimed).length },
          { key: "claimed", label: "Resgatadas", count: rewards.filter((reward) => reward.claimed).length },
        ]}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      <div className="stats-grid stats-grid--compact">
        <StatCard label="Recompensas abertas" value={`${rewards.filter((reward) => !reward.claimed).length}`} helper="itens prontos para trocar" tone="primary" />
        <StatCard label="Ja resgatadas" value={`${rewards.filter((reward) => reward.claimed).length}`} helper="historico de premios" tone="success" />
      </div>

      <RewardComposer onSubmit={handleCreateReward} />

      <div className="reward-grid">
        {visibleRewards.length === 0 ? (
          <article className="empty-card">
            <h3>Nenhuma recompensa cadastrada</h3>
            <p>Use o formulario acima para criar sua primeira recompensa da loja.</p>
          </article>
        ) : null}
        {visibleRewards.map((reward) => {
          const canRedeem = !reward.claimed && reward.cost <= (session?.user.points ?? 0);

          return (
            <article key={reward.id} className={`reward-card reward-card--${reward.accent}`}>
              <div className="reward-card__top">
                <span className="pill">{reward.claimed ? "Resgatada" : "Disponivel"}</span>
                <strong>{reward.cost} XP</strong>
              </div>
              <h3>{reward.title}</h3>
              <p>{reward.description}</p>
              <button
                type="button"
                className={canRedeem ? "primary-button" : "secondary-button"}
                disabled={!canRedeem}
                onClick={() => void handleRedeemReward(reward.id)}
              >
                {reward.claimed ? "Ja resgatada" : canRedeem ? "Resgatar agora" : "Saldo insuficiente"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default RewardsPage;
