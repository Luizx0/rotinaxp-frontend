import {
  createEmptyRewardDraft,
  getRewards,
  createReward,
  redeemReward,
} from "../../src/services/rewardService";
import { writeStorage, storageKeys } from "../../src/services/storage";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loginAs(userId: string) {
  writeStorage(storageKeys.authSession, { user: { id: userId } });
}

beforeEach(() => {
  localStorage.clear();
});

// ─── createEmptyRewardDraft ───────────────────────────────────────────────────

describe("createEmptyRewardDraft", () => {
  it("retorna título e descrição vazios", () => {
    const draft = createEmptyRewardDraft();
    expect(draft.title).toBe("");
    expect(draft.description).toBe("");
  });

  it("retorna custo padrão de 60 pontos", () => {
    expect(createEmptyRewardDraft().cost).toBe(60);
  });

  it("retorna accent 'sunrise' como padrão", () => {
    expect(createEmptyRewardDraft().accent).toBe("sunrise");
  });
});

// ─── getRewards ───────────────────────────────────────────────────────────────

describe("getRewards", () => {
  it("lança erro quando não há usuário logado", async () => {
    await expect(getRewards()).rejects.toThrow(
      "Sessao de usuario nao encontrada."
    );
  });

  it("retorna lista vazia para usuário novo", async () => {
    loginAs("user-novo");
    const rewards = await getRewards();
    expect(Array.isArray(rewards)).toBe(true);
    expect(rewards).toHaveLength(0);
  });

  it("retorna recompensas de seed para o usuário demo", async () => {
    loginAs("user-demo");
    const rewards = await getRewards();
    expect(rewards.length).toBeGreaterThan(0);
  });
});

// ─── createReward ─────────────────────────────────────────────────────────────

describe("createReward", () => {
  it("lança erro quando não há usuário logado", async () => {
    await expect(
      createReward({ title: "Teste", description: "", cost: 100, accent: "ocean" })
    ).rejects.toThrow("Sessao de usuario nao encontrada.");
  });

  it("cria e persiste uma nova recompensa", async () => {
    loginAs("user-teste");
    const reward = await createReward({
      title: "Férias",
      description: "Descanso merecido",
      cost: 200,
      accent: "ocean",
    });
    expect(reward.title).toBe("Férias");
    expect(reward.description).toBe("Descanso merecido");
    expect(reward.cost).toBe(200);
    expect(reward.claimed).toBe(false);
    expect(reward.accent).toBe("ocean");
    expect(reward.id).toBeTruthy();
  });

  it("garante custo mínimo de 10 pontos", async () => {
    loginAs("user-teste");
    const reward = await createReward({
      title: "Barato demais",
      description: "",
      cost: 3,
      accent: "ember",
    });
    expect(reward.cost).toBe(10);
  });

  it("remove espaços extras do título e da descrição", async () => {
    loginAs("user-teste");
    const reward = await createReward({
      title: "  Nome com espaço  ",
      description: "  desc  ",
      cost: 50,
      accent: "forest",
    });
    expect(reward.title).toBe("Nome com espaço");
    expect(reward.description).toBe("desc");
  });

  it("a recompensa criada aparece na listagem", async () => {
    loginAs("user-teste");
    await createReward({
      title: "Recompensa A",
      description: "",
      cost: 30,
      accent: "sunrise",
    });
    await createReward({
      title: "Recompensa B",
      description: "",
      cost: 40,
      accent: "ocean",
    });
    const rewards = await getRewards();
    expect(rewards).toHaveLength(2);
    const titulos = rewards.map((r) => r.title);
    expect(titulos).toContain("Recompensa A");
    expect(titulos).toContain("Recompensa B");
  });
});

// ─── redeemReward ─────────────────────────────────────────────────────────────

describe("redeemReward", () => {
  it("lança erro quando a recompensa não existe", async () => {
    loginAs("user-teste");
    await expect(redeemReward("id-inexistente")).rejects.toThrow(
      "Recompensa nao encontrada."
    );
  });

  it("marca a recompensa como resgatada (claimed = true)", async () => {
    loginAs("user-teste");
    const criada = await createReward({
      title: "Prêmio",
      description: "",
      cost: 100,
      accent: "sunrise",
    });
    expect(criada.claimed).toBe(false);
    const resgatada = await redeemReward(criada.id);
    expect(resgatada.claimed).toBe(true);
  });

  it("persiste o estado resgatado após nova consulta", async () => {
    loginAs("user-teste");
    const criada = await createReward({
      title: "Prêmio",
      description: "",
      cost: 100,
      accent: "sunrise",
    });
    await redeemReward(criada.id);
    const rewards = await getRewards();
    const encontrada = rewards.find((r) => r.id === criada.id);
    expect(encontrada!.claimed).toBe(true);
  });

  it("não altera outras recompensas ao resgatar uma", async () => {
    loginAs("user-teste");
    // Use fake timers so Date.now() avança entre chamadas, garantindo IDs únicos
    jest.useFakeTimers();
    const r1 = await createReward({
      title: "R1",
      description: "",
      cost: 50,
      accent: "ocean",
    });
    jest.advanceTimersByTime(2);
    const r2 = await createReward({
      title: "R2",
      description: "",
      cost: 60,
      accent: "forest",
    });
    jest.useRealTimers();
    await redeemReward(r1.id);
    const rewards = await getRewards();
    const r2Atualizado = rewards.find((r) => r.id === r2.id)!;
    expect(r2Atualizado.claimed).toBe(false);
  });
});
