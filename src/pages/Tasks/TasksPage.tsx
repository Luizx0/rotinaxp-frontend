import { motion } from "framer-motion";
import { useState } from "react";
import AlertBanner from "../../components/common/AlertBanner";
import { fadeInUp, staggerContainer } from "../../components/common/motion";
import Modal from "../../components/common/Modal";
import PageTabs from "../../components/common/PageTabs";
import TaskComposer from "../../components/tasks/TaskComposer";
import TaskList from "../../components/tasks/TaskList";
import { useAppData } from "../../hooks/useAppData";
import { useModal } from "../../hooks/useModal";
import { getErrorMessage } from "../../services/errorService";
import { Task, TaskDraft } from "../../types/app";

function taskToDraft(task: Task): TaskDraft {
  return {
    title: task.title,
    description: task.description,
    category: task.category,
    priority: task.priority,
    dueDate: task.dueDate.slice(0, 10),
    points: task.points,
  };
}

function TasksPage() {
  const { tasks, addTask, updateTask, toggleTask, isLoading, error, clearError } = useAppData();
  const [activeTab, setActiveTab] = useState("all");
  const [localError, setLocalError] = useState<string | null>(null);
  const editModal = useModal<Task>();

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "open") {
      return !task.completed;
    }

    if (activeTab === "completed") {
      return task.completed;
    }

    return true;
  });

  async function handleCreateSubmit(draft: TaskDraft) {
    setLocalError(null);
    clearError();

    try {
      await addTask(draft);
    } catch (currentError) {
      setLocalError(getErrorMessage(currentError, "Nao foi possivel criar a tarefa."));
    }
  }

  async function handleEditSubmit(draft: TaskDraft) {
    if (!editModal.payload) {
      return;
    }

    setLocalError(null);
    clearError();

    try {
      await updateTask(editModal.payload.id, draft);
      editModal.close();
    } catch (currentError) {
      setLocalError(getErrorMessage(currentError, "Nao foi possivel atualizar a tarefa."));
    }
  }

  async function handleToggleTask(taskId: string) {
    setLocalError(null);
    clearError();

    try {
      await toggleTask(taskId);
    } catch (currentError) {
      setLocalError(getErrorMessage(currentError, "Nao foi possivel alterar o status da tarefa."));
    }
  }

  return (
    <section className="page-stack">
      <motion.div className="page-hero" variants={fadeInUp} initial="hidden" animate="show">
        <div>
          <p className="section-eyebrow">Execucao</p>
          <h2>Tarefas</h2>
          <p>Crie, ajuste, conclua e reorganize as tarefas em uma pagina com filtros e overlay de edicao.</p>
        </div>
      </motion.div>

      {isLoading ? <p className="form-hint">Carregando tarefas...</p> : null}
      {error ? <AlertBanner message={error} /> : null}
      {localError ? <AlertBanner message={localError} /> : null}

      <PageTabs
        tabs={[
          { key: "all", label: "Todas", count: tasks.length },
          { key: "open", label: "Abertas", count: tasks.filter((task) => !task.completed).length },
          { key: "completed", label: "Concluidas", count: tasks.filter((task) => task.completed).length },
        ]}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      <motion.div className="tasks-layout" variants={staggerContainer} initial="hidden" animate="show">
        <motion.div className="tour-tasks-composer" variants={fadeInUp}>
          <TaskComposer title="Nova tarefa" submitLabel="Criar tarefa" onSubmit={handleCreateSubmit} />
        </motion.div>
        <motion.div className="tour-tasks-list" variants={fadeInUp}>
          <TaskList tasks={filteredTasks} onToggle={handleToggleTask} onEdit={editModal.open} />
        </motion.div>
      </motion.div>

      <Modal isOpen={editModal.isOpen} title="Editar tarefa" onClose={editModal.close}>
        {editModal.payload ? (
          <TaskComposer
            title="Atualizar tarefa"
            submitLabel="Salvar alteracoes"
            initialValue={taskToDraft(editModal.payload)}
            onSubmit={handleEditSubmit}
            onCancel={editModal.close}
          />
        ) : null}
      </Modal>
    </section>
  );
}

export default TasksPage;
