import {
  readStorage,
  writeStorage,
  getStoredSessionUserId,
  storageKeys,
} from "../../src/services/storage";

beforeEach(() => {
  localStorage.clear();
});

// ─── readStorage ──────────────────────────────────────────────────────────────

describe("readStorage", () => {
  it("retorna o fallback quando a chave não existe", () => {
    const result = readStorage("chave-inexistente", "fallback");
    expect(result).toBe("fallback");
  });

  it("retorna o valor parseado quando a chave existe", () => {
    localStorage.setItem("chave", JSON.stringify({ nome: "teste" }));
    const result = readStorage<{ nome: string }>("chave", { nome: "" });
    expect(result.nome).toBe("teste");
  });

  it("retorna o fallback quando o JSON armazenado é inválido", () => {
    localStorage.setItem("chave", "JSON_INVALIDO{{{");
    const result = readStorage("chave", "fallback");
    expect(result).toBe("fallback");
  });

  it("retorna o fallback quando o valor armazenado é string vazia", () => {
    localStorage.setItem("chave", "");
    const result = readStorage("chave", 42);
    expect(result).toBe(42);
  });

  it("retorna arrays parseados corretamente", () => {
    localStorage.setItem("lista", JSON.stringify([1, 2, 3]));
    const result = readStorage<number[]>("lista", []);
    expect(result).toEqual([1, 2, 3]);
  });
});

// ─── writeStorage ─────────────────────────────────────────────────────────────

describe("writeStorage", () => {
  it("persiste um objeto como JSON no localStorage", () => {
    writeStorage("chave", { texto: "valor" });
    const raw = localStorage.getItem("chave");
    expect(JSON.parse(raw!)).toEqual({ texto: "valor" });
  });

  it("persiste arrays corretamente", () => {
    writeStorage("lista", [1, 2, 3]);
    const raw = localStorage.getItem("lista");
    expect(JSON.parse(raw!)).toEqual([1, 2, 3]);
  });

  it("persiste valores primitivos corretamente", () => {
    writeStorage("numero", 99);
    const raw = localStorage.getItem("numero");
    expect(JSON.parse(raw!)).toBe(99);
  });

  it("sobrescreve um valor existente", () => {
    writeStorage("chave", "primeiro");
    writeStorage("chave", "segundo");
    expect(readStorage("chave", "")).toBe("segundo");
  });
});

// ─── getStoredSessionUserId ───────────────────────────────────────────────────

describe("getStoredSessionUserId", () => {
  it("retorna null quando não há sessão armazenada", () => {
    expect(getStoredSessionUserId()).toBeNull();
  });

  it("retorna o userId quando a sessão está armazenada", () => {
    writeStorage(storageKeys.authSession, { user: { id: "user-123" } });
    expect(getStoredSessionUserId()).toBe("user-123");
  });

  it("retorna null quando a sessão não possui campo user", () => {
    writeStorage(storageKeys.authSession, { token: "abc" });
    expect(getStoredSessionUserId()).toBeNull();
  });

  it("retorna null quando user não possui campo id", () => {
    writeStorage(storageKeys.authSession, { user: { email: "x@y.com" } });
    expect(getStoredSessionUserId()).toBeNull();
  });
});
