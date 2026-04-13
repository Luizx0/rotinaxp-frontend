import {
  createEmptyTaskDraft,
  getTarefas,
  criarTarefa,
  atualizarTarefa,
  alternarConclusao,
} from "../../src/services/tarefaService";
import { writeStorage, storageKeys } from "../../src/services/storage";
import api from "../../src/services/api";

// ─── Mock do módulo de API ────────────────────────────────────────────────────

jest.mock("../../src/services/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockGet = api.get as jest.Mock;
const mockPost = api.post as jest.Mock;
const mockPut = api.put as jest.Mock;
const mockPatch = api.patch as jest.Mock;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loginAs(userId: string) {
  writeStorage(storageKeys.authSession, { user: { id: userId } });
}

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

// ─── createEmptyTaskDraft ─────────────────────────────────────────────────────

describe("createEmptyTaskDraft", () => {
  it("retorna um draft com título e descrição vazios", () => {
    const draft = createEmptyTaskDraft();
    expect(draft.title).toBe("");
    expect(draft.description).toBe("");
  });

  it("retorna categoria 'Pessoal' e prioridade 'media' como padrão", () => {
    const draft = createEmptyTaskDraft();
    expect(draft.category).toBe("Pessoal");
    expect(draft.priority).toBe("media");
  });

  it("retorna 30 pontos como valor padrão", () => {
    const draft = createEmptyTaskDraft();
    expect(draft.points).toBe(30);
  });

  it("define a data de vencimento para amanhã", () => {
    const draft = createEmptyTaskDraft();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(draft.dueDate).toBe(tomorrow.toISOString().slice(0, 10));
  });
});

// ─── getTarefas ───────────────────────────────────────────────────────────────

describe("getTarefas", () => {
  it("lança erro quando não há usuário logado", async () => {
    await expect(getTarefas()).rejects.toThrow(
      "Sessao de usuario nao encontrada."
    );
  });

  it("retorna lista vazia para novo usuário quando a API falha", async () => {
    loginAs("user-novo");
    mockGet.mockRejectedValue(new Error("Network Error"));
    const tasks = await getTarefas();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks).toHaveLength(0);
  });

  it("retorna tarefas de seed para o usuário demo quando a API falha", async () => {
    loginAs("user-demo");
    mockGet.mockRejectedValue(new Error("Network Error"));
    const tasks = await getTarefas();
    expect(tasks.length).toBeGreaterThan(0);
  });

  it("mapeia e retorna as tarefas quando a API responde com sucesso", async () => {
    loginAs("user-api");
    mockGet.mockResolvedValue({
      data: [
        {
          id: "t1",
          nome: "Tarefa da API",
          descricao: "Descricao",
          categoria: "Trabalho",
          prioridade: "alta",
          concluida: false,
          createdAt: new Date().toISOString(),
          dataLimite: new Date().toISOString(),
          pontos: 50,
        },
      ],
    });
    const tasks = await getTarefas();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("Tarefa da API");
    expect(tasks[0].category).toBe("Trabalho");
  });
});

// ─── criarTarefa ──────────────────────────────────────────────────────────────

const novaDraft = {
  title: "Nova Tarefa",
  description: "Descrição",
  category: "Estudos" as const,
  priority: "alta" as const,
  dueDate: "2026-12-31",
  points: 50,
};

describe("criarTarefa", () => {
  it("lança erro quando não há usuário logado", async () => {
    await expect(criarTarefa(novaDraft)).rejects.toThrow(
      "Sessao de usuario nao encontrada."
    );
  });

  it("cria tarefa no localStorage como fallback quando a API falha", async () => {
    loginAs("user-teste");
    mockPost.mockRejectedValue(new Error("Network Error"));
    const task = await criarTarefa(novaDraft);
    expect(task.title).toBe("Nova Tarefa");
    expect(task.completed).toBe(false);
    expect(task.points).toBe(50);
  });

  it("a tarefa criada aparece na listagem posterior", async () => {
    loginAs("user-teste");
    mockPost.mockRejectedValue(new Error("Network Error"));
    mockGet.mockRejectedValue(new Error("Network Error"));
    await criarTarefa(novaDraft);
    const tasks = await getTarefas();
    expect(tasks.some((t) => t.title === "Nova Tarefa")).toBe(true);
  });

  it("usa os dados da API quando a resposta é bem-sucedida", async () => {
    loginAs("user-teste");
    mockPost.mockResolvedValue({
      data: {
        id: "api-task-1",
        nome: "Nova Tarefa",
        descricao: "Descrição",
        categoria: "Estudos",
        prioridade: "alta",
        concluida: false,
        createdAt: new Date().toISOString(),
        dataLimite: "2026-12-31",
        pontos: 50,
      },
    });
    const task = await criarTarefa(novaDraft);
    expect(task.id).toBe("api-task-1");
  });
});

// ─── alternarConclusao ────────────────────────────────────────────────────────

describe("alternarConclusao", () => {
  it("lança erro quando a tarefa não existe", async () => {
    loginAs("user-teste");
    await expect(alternarConclusao("id-fantasma")).rejects.toThrow(
      "Tarefa nao encontrada."
    );
  });

  it("marca como concluída uma tarefa pendente", async () => {
    loginAs("user-demo");
    mockGet.mockRejectedValue(new Error("Network Error"));
    mockPatch.mockRejectedValue(new Error("Network Error"));
    const tasks = await getTarefas();
    const pendente = tasks.find((t) => !t.completed)!;
    const result = await alternarConclusao(pendente.id);
    expect(result.completed).toBe(true);
  });

  it("desmarca uma tarefa já concluída", async () => {
    loginAs("user-demo");
    mockGet.mockRejectedValue(new Error("Network Error"));
    mockPatch.mockRejectedValue(new Error("Network Error"));
    const tasks = await getTarefas();
    const concluida = tasks.find((t) => t.completed)!;
    const result = await alternarConclusao(concluida.id);
    expect(result.completed).toBe(false);
  });

  it("alterna de volta após duas chamadas", async () => {
    loginAs("user-demo");
    mockGet.mockRejectedValue(new Error("Network Error"));
    mockPatch.mockRejectedValue(new Error("Network Error"));
    const tasks = await getTarefas();
    const task = tasks[0];
    const estadoOriginal = task.completed;
    await alternarConclusao(task.id);
    const voltou = await alternarConclusao(task.id);
    expect(voltou.completed).toBe(estadoOriginal);
  });
});

// ─── atualizarTarefa ──────────────────────────────────────────────────────────

describe("atualizarTarefa", () => {
  it("lança erro quando a tarefa não existe", async () => {
    loginAs("user-teste");
    const draft = {
      title: "X",
      description: "",
      category: "Pessoal" as const,
      priority: "baixa" as const,
      dueDate: "2026-01-01",
      points: 10,
    };
    await expect(atualizarTarefa("id-inexistente", draft)).rejects.toThrow(
      "Tarefa nao encontrada."
    );
  });

  it("atualiza título e pontos no localStorage quando a API falha", async () => {
    loginAs("user-demo");
    mockGet.mockRejectedValue(new Error("Network Error"));
    mockPut.mockRejectedValue(new Error("Network Error"));
    const tasks = await getTarefas();
    const tarefa = tasks[0];
    const draft = {
      title: "Título Atualizado",
      description: tarefa.description,
      category: tarefa.category,
      priority: tarefa.priority,
      dueDate: tarefa.dueDate,
      points: 99,
    };
    const resultado = await atualizarTarefa(tarefa.id, draft);
    expect(resultado.title).toBe("Título Atualizado");
    expect(resultado.points).toBe(99);
  });

  it("usa os dados da API quando a resposta é bem-sucedida", async () => {
    loginAs("user-demo");
    mockGet.mockRejectedValue(new Error("Network Error"));
    const tasks = await getTarefas();
    const tarefa = tasks[0];
    mockPut.mockResolvedValue({
      data: {
        id: tarefa.id,
        nome: "Via API",
        descricao: tarefa.description,
        categoria: tarefa.category,
        prioridade: tarefa.priority,
        concluida: tarefa.completed,
        createdAt: tarefa.createdAt,
        dataLimite: tarefa.dueDate,
        pontos: 77,
      },
    });
    const resultado = await atualizarTarefa(tarefa.id, {
      title: "Via API",
      description: tarefa.description,
      category: tarefa.category,
      priority: tarefa.priority,
      dueDate: tarefa.dueDate,
      points: 77,
    });
    expect(resultado.title).toBe("Via API");
    expect(resultado.points).toBe(77);
  });
});
