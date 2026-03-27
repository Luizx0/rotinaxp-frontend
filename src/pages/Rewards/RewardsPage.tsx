import { useState } from "react";
import PageTabs from "../../components/common/PageTabs";
import StatCard from "../../components/common/StatCard";
import { useAppData } from "../../hooks/useAppData";
import { useAuth } from "../../hooks/useAuth";

function RewardsPage() {
  const { rewards, redeemReward } = useAppData();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("available");

  const visibleRewards = rewards.filter((reward) => {
    if (activeTab === "claimed") {
      return reward.claimed;
    }

    return !reward.claimed;
  });

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

      <div className="reward-grid">
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
                onClick={() => void redeemReward(reward.id)}
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
