import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getErrorMessage } from "../../src/services/errorService";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeAxiosError(
  message: string,
  responseData?: unknown,
  status = 400
): AxiosError {
  const error = new AxiosError(message);
  if (responseData !== undefined) {
    error.response = {
      data: responseData,
      status,
      statusText: "Bad Request",
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };
  }
  return error;
}

// ─── getErrorMessage ──────────────────────────────────────────────────────────

describe("getErrorMessage", () => {
  it("retorna a mensagem de um Error padrão", () => {
    const error = new Error("Algo deu errado");
    expect(getErrorMessage(error)).toBe("Algo deu errado");
  });

  it("retorna o fallback padrão para null", () => {
    expect(getErrorMessage(null)).toBe(
      "Nao foi possivel concluir a operacao. Tente novamente."
    );
  });

  it("retorna o fallback padrão para undefined", () => {
    expect(getErrorMessage(undefined)).toBe(
      "Nao foi possivel concluir a operacao. Tente novamente."
    );
  });

  it("retorna o fallback personalizado para tipo desconhecido", () => {
    expect(getErrorMessage(42, "Erro customizado")).toBe("Erro customizado");
  });

  it("retorna a mensagem string da resposta axios", () => {
    const error = makeAxiosError("request failed", "Credenciais invalidas", 401);
    expect(getErrorMessage(error)).toBe("Credenciais invalidas");
  });

  it("retorna a propriedade message do objeto de resposta axios", () => {
    const error = makeAxiosError("request failed", { message: "Token expirado" }, 401);
    expect(getErrorMessage(error)).toBe("Token expirado");
  });

  it("retorna a mensagem do próprio AxiosError quando não há resposta", () => {
    const error = new axios.AxiosError("Network Error");
    expect(getErrorMessage(error)).toBe("Network Error");
  });

  it("cai para error.message quando a resposta axios é só espaços em branco", () => {
    const error = makeAxiosError("request failed", "   ", 500);
    // response.data.trim() === "" → cai para error.message
    expect(getErrorMessage(error)).toBe("request failed");
  });

  it("cai para error.message quando o objeto de resposta não possui message", () => {
    const error = makeAxiosError("request failed", { code: 42 }, 500);
    // response.data.message não existe → cai para error.message
    expect(getErrorMessage(error)).toBe("request failed");
  });

  it("retorna o fallback quando a resposta e message do axios estão vazios", () => {
    const error = makeAxiosError("", null, 500);
    expect(getErrorMessage(error)).toBe(
      "Nao foi possivel concluir a operacao. Tente novamente."
    );
  });
});
