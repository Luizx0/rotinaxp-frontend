import api from "./api";

export async function getTarefas() {
  const response = await api.get("/tarefas");
  return response.data;
}

export async function criarTarefa(nome) {
  const response = await api.post("/tarefas", {
    nome,
    concluida: false,
  });

  return response.data;
}
