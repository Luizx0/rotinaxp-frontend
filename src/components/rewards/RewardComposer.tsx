import { FormEvent, useEffect, useState } from "react";
import { createEmptyRewardDraft } from "../../services/rewardService";
import { RewardDraft } from "../../types/app";

interface RewardComposerProps {
  onSubmit: (draft: RewardDraft) => Promise<void>;
}

function RewardComposer({ onSubmit }: RewardComposerProps) {
  const [formState, setFormState] = useState<RewardDraft>(createEmptyRewardDraft());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormState(createEmptyRewardDraft());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formState.title.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formState,
        title: formState.title.trim(),
        description: formState.description.trim(),
      });
      setFormState(createEmptyRewardDraft());
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="panel-card" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">Loja</p>
          <h3>Criar recompensa</h3>
        </div>
      </div>

      <div className="form-grid">
        <label>
          <span>Titulo</span>
          <input
            value={formState.title}
            onChange={(event) => setFormState((currentState) => ({ ...currentState, title: event.target.value }))}
            placeholder="Ex.: noite livre"
          />
        </label>

        <label>
          <span>Custo (XP)</span>
          <input
            type="number"
            min={10}
            step={5}
            value={formState.cost}
            onChange={(event) =>
              setFormState((currentState) => ({ ...currentState, cost: Number(event.target.value) || 10 }))
            }
          />
        </label>

        <label className="form-grid__full">
          <span>Descricao</span>
          <textarea
            rows={3}
            value={formState.description}
            onChange={(event) => setFormState((currentState) => ({ ...currentState, description: event.target.value }))}
            placeholder="Descreva o que sera desbloqueado"
          />
        </label>

        <label>
          <span>Estilo visual</span>
          <select
            value={formState.accent}
            onChange={(event) =>
              setFormState((currentState) => ({ ...currentState, accent: event.target.value as RewardDraft["accent"] }))
            }
          >
            <option value="sunrise">Sunrise</option>
            <option value="ocean">Ocean</option>
            <option value="forest">Forest</option>
            <option value="ember">Ember</option>
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Criando..." : "Adicionar recompensa"}
        </button>
      </div>
    </form>
  );
}

export default RewardComposer;
