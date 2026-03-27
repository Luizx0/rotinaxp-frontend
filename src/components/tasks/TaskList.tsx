import { motion } from "framer-motion";
import { fadeInUp } from "../common/motion";
import { Task } from "../../types/app";

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => Promise<void>;
  onEdit: (task: Task) => void;
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(dateValue));
}

function TaskList({ tasks, onToggle, onEdit }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <article className="empty-card">
        <h3>Nenhuma tarefa nesse filtro</h3>
        <p>Crie uma nova tarefa ou ajuste a aba para visualizar outro conjunto.</p>
      </article>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <motion.article key={task.id} className={`task-item ${task.completed ? "task-item--completed" : ""}`} variants={fadeInUp}>
          <div className="task-item__meta">
            <span className="pill">{task.category}</span>
            <span className={`pill pill--priority-${task.priority}`}>{task.priority}</span>
          </div>

          <div className="task-item__content">
            <h3>{task.title}</h3>
            <p>{task.description || "Sem descricao adicional."}</p>
          </div>

          <div className="task-item__footer">
            <div>
              <strong>{task.points} XP</strong>
              <p>Entrega ate {formatDate(task.dueDate)}</p>
            </div>

            <div className="task-item__actions">
              <button type="button" className="secondary-button" onClick={() => onEdit(task)}>
                Editar
              </button>
              <button type="button" className="primary-button" onClick={() => void onToggle(task.id)}>
                {task.completed ? "Reabrir" : "Concluir"}
              </button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export default TaskList;
