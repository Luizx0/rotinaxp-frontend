import { FormEvent, useEffect, useState } from "react";
import { taskCategories, taskPriorities } from "../../data/mockData";
import { createEmptyTaskDraft } from "../../services/tarefaService";
import { TaskDraft } from "../../types/app";

interface TaskComposerProps {
  title: string;
  initialValue?: TaskDraft;
  submitLabel: string;
  onSubmit: (draft: TaskDraft) => Promise<void>;
  onCancel?: () => void;
}

function TaskComposer({ title, initialValue, submitLabel, onSubmit, onCancel }: TaskComposerProps) {
  const [formState, setFormState] = useState<TaskDraft>(initialValue ?? createEmptyTaskDraft());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormState(initialValue ?? createEmptyTaskDraft());
  }, [initialValue]);

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

      if (!initialValue) {
        setFormState(createEmptyTaskDraft());
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="task-composer" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">Tarefas</p>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="form-grid">
        <label>
          <span>Titulo</span>
          <input
            value={formState.title}
            onChange={(event) => setFormState((currentState) => ({ ...currentState, title: event.target.value }))}
            placeholder="Ex.: revisar dashboard"
          />
        </label>

        <label>
          <span>Categoria</span>
          <select
            value={formState.category}
            onChange={(event) =>
              setFormState((currentState) => ({ ...currentState, category: event.target.value as TaskDraft["category"] }))
            }
          >
            {taskCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="form-grid__full">
          <span>Descricao</span>
          <textarea
            rows={4}
            value={formState.description}
            onChange={(event) => setFormState((currentState) => ({ ...currentState, description: event.target.value }))}
            placeholder="Descreva o contexto dessa tarefa"
          />
        </label>

        <label>
          <span>Prioridade</span>
          <select
            value={formState.priority}
            onChange={(event) =>
              setFormState((currentState) => ({ ...currentState, priority: event.target.value as TaskDraft["priority"] }))
            }
          >
            {taskPriorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Data limite</span>
          <input
            type="date"
            value={formState.dueDate.slice(0, 10)}
            onChange={(event) => setFormState((currentState) => ({ ...currentState, dueDate: event.target.value }))}
          />
        </label>

        <label>
          <span>Pontos</span>
          <input
            type="number"
            min={10}
            max={200}
            step={5}
            value={formState.points}
            onChange={(event) =>
              setFormState((currentState) => ({ ...currentState, points: Number(event.target.value) || 10 }))
            }
          />
        </label>
      </div>

      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancelar
          </button>
        ) : null}
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default TaskComposer;
