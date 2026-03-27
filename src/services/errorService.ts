import axios from "axios";

const defaultErrorMessage = "Nao foi possivel concluir a operacao. Tente novamente.";

export function getErrorMessage(error: unknown, fallback = defaultErrorMessage): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data;

    if (typeof responseMessage === "string" && responseMessage.trim()) {
      return responseMessage;
    }

    if (responseMessage && typeof responseMessage === "object") {
      const message = (responseMessage as { message?: unknown }).message;

      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }

    if (typeof error.message === "string" && error.message.trim()) {
      return error.message;
    }

    return fallback;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
