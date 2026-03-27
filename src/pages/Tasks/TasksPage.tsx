import { useState } from "react";
import Modal from "../../components/common/Modal";
import PageTabs from "../../components/common/PageTabs";
import TaskComposer from "../../components/tasks/TaskComposer";
import TaskList from "../../components/tasks/TaskList";
import { useAppData } from "../../hooks/useAppData";
import { useModal } from "../../hooks/useModal";
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
  const { tasks, addTask, updateTask, toggleTask } = useAppData();
  const [activeTab, setActiveTab] = useState("all");
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

  async function handleEditSubmit(draft: TaskDraft) {
    if (!editModal.payload) {
      return;
    }

    await updateTask(editModal.payload.id, draft);
    editModal.close();
  }

  return (
    <section className="page-stack">
      <div className="page-hero">
        <div>
          <p className="section-eyebrow">Execucao</p>
          <h2>Tarefas</h2>
          <p>Crie, ajuste, conclua e reorganize as tarefas em uma pagina com filtros e overlay de edicao.</p>
        </div>
      </div>

      <PageTabs
        tabs={[
          { key: "all", label: "Todas", count: tasks.length },
          { key: "open", label: "Abertas", count: tasks.filter((task) => !task.completed).length },
          { key: "completed", label: "Concluidas", count: tasks.filter((task) => task.completed).length },
        ]}
        activeKey={activeTab}
        onChange={setActiveTab}
      />

      <div className="tasks-layout">
        <TaskComposer title="Nova tarefa" submitLabel="Criar tarefa" onSubmit={addTask} />
        <TaskList tasks={filteredTasks} onToggle={toggleTask} onEdit={editModal.open} />
      </div>

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
