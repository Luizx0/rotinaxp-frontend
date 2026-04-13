import {
  loginUser,
  registerUser,
  getLevelFromPoints,
  getStoredSession,
  clearSession,
  updateStoredUser,
} from "../../src/services/authService";

beforeEach(() => {
  localStorage.clear();
});

// ─── getLevelFromPoints ───────────────────────────────────────────────────────

describe("getLevelFromPoints", () => {
  it("retorna nível 1 para 0 pontos", () => {
    expect(getLevelFromPoints(0)).toBe(1);
  });

  it("retorna nível 1 para menos de 100 pontos", () => {
    expect(getLevelFromPoints(99)).toBe(1);
  });

  it("retorna nível 2 para exatamente 100 pontos", () => {
    expect(getLevelFromPoints(100)).toBe(2);
  });

  it("retorna nível 4 para 340 pontos (perfil demo)", () => {
    expect(getLevelFromPoints(340)).toBe(4);
  });

  it("retorna nível crescente conforme pontos aumentam", () => {
    const nivel1 = getLevelFromPoints(50);
    const nivel2 = getLevelFromPoints(150);
    const nivel3 = getLevelFromPoints(250);
    expect(nivel1).toBeLessThan(nivel2);
    expect(nivel2).toBeLessThan(nivel3);
  });
});

// ─── loginUser ────────────────────────────────────────────────────────────────

describe("loginUser", () => {
  it("autentica o usuário demo com credenciais corretas", async () => {
    const session = await loginUser({
      email: "demo@rotinaxp.app",
      password: "demo123",
    });
    expect(session.user.email).toBe("demo@rotinaxp.app");
    expect(session.token).toContain("demo-token");
  });

  it("persiste a sessão no localStorage após login", async () => {
    await loginUser({ email: "demo@rotinaxp.app", password: "demo123" });
    expect(localStorage.getItem("rotinaxp.auth.session")).not.toBeNull();
  });

  it("lança erro com senha incorreta", async () => {
    await expect(
      loginUser({ email: "demo@rotinaxp.app", password: "senha-errada" })
    ).rejects.toThrow("Credenciais invalidas.");
  });

  it("lança erro quando o email não existe", async () => {
    await expect(
      loginUser({ email: "nao-existe@test.com", password: "qualquer" })
    ).rejects.toThrow("Credenciais invalidas.");
  });

  it("autentica independente de maiúsculas/minúsculas no email", async () => {
    const session = await loginUser({
      email: "DEMO@ROTINAXP.APP",
      password: "demo123",
    });
    expect(session.user.id).toBe("user-demo");
  });
});

// ─── registerUser ─────────────────────────────────────────────────────────────

describe("registerUser", () => {
  it("registra um novo usuário com dados válidos", async () => {
    const session = await registerUser({
      name: "Maria Silva",
      email: "maria@test.com",
      password: "123456",
    });
    expect(session.user.name).toBe("Maria Silva");
    expect(session.user.email).toBe("maria@test.com");
    expect(session.user.points).toBe(0);
    expect(session.user.level).toBe(1);
    expect(session.user.streak).toBe(0);
  });

  it("lança erro ao registrar com email já cadastrado", async () => {
    await registerUser({
      name: "Primeiro",
      email: "duplicado@test.com",
      password: "123456",
    });
    await expect(
      registerUser({
        name: "Segundo",
        email: "duplicado@test.com",
        password: "abcdef",
      })
    ).rejects.toThrow("Ja existe uma conta com esse email.");
  });

  it("normaliza o email do novo usuário para letras minúsculas", async () => {
    const session = await registerUser({
      name: "Carlos",
      email: "CARLOS@TEST.COM",
      password: "senha",
    });
    expect(session.user.email).toBe("carlos@test.com");
  });

  it("persiste a sessão do novo usuário no localStorage", async () => {
    await registerUser({
      name: "Teste",
      email: "novo@test.com",
      password: "abc",
    });
    expect(localStorage.getItem("rotinaxp.auth.session")).not.toBeNull();
  });

  it("o novo usuário pode logar após o registro", async () => {
    await registerUser({
      name: "Ana",
      email: "ana@test.com",
      password: "minhaSenha",
    });
    // A sessão ativa não impede um novo login com as mesmas credenciais
    const session = await loginUser({
      email: "ana@test.com",
      password: "minhaSenha",
    });
    expect(session.user.email).toBe("ana@test.com");
  });
});

// ─── getStoredSession ─────────────────────────────────────────────────────────

describe("getStoredSession", () => {
  it("retorna null quando não há sessão armazenada", () => {
    expect(getStoredSession()).toBeNull();
  });

  it("retorna a sessão válida após login", async () => {
    await loginUser({ email: "demo@rotinaxp.app", password: "demo123" });
    const session = getStoredSession();
    expect(session).not.toBeNull();
    expect(session!.user.email).toBe("demo@rotinaxp.app");
  });
});

// ─── clearSession ─────────────────────────────────────────────────────────────

describe("clearSession", () => {
  it("remove a sessão do localStorage", async () => {
    await loginUser({ email: "demo@rotinaxp.app", password: "demo123" });
    expect(getStoredSession()).not.toBeNull();
    clearSession();
    expect(getStoredSession()).toBeNull();
  });
});

// ─── updateStoredUser ─────────────────────────────────────────────────────────

describe("updateStoredUser", () => {
  it("atualiza o nome do usuário logado", async () => {
    const session = await loginUser({
      email: "demo@rotinaxp.app",
      password: "demo123",
    });
    const updated = await updateStoredUser(session.user.id, {
      name: "Luiz Atualizado",
    });
    expect(updated.name).toBe("Luiz Atualizado");
  });

  it("recalcula o nível ao atualizar os pontos", async () => {
    const session = await loginUser({
      email: "demo@rotinaxp.app",
      password: "demo123",
    });
    const updated = await updateStoredUser(session.user.id, { points: 200 });
    expect(updated.level).toBe(getLevelFromPoints(200));
  });

  it("lança erro quando o userId não existe", async () => {
    await loginUser({ email: "demo@rotinaxp.app", password: "demo123" });
    await expect(
      updateStoredUser("id-inexistente", { name: "Fantasma" })
    ).rejects.toThrow("Usuario nao encontrado.");
  });
});
