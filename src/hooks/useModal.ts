import { useState } from "react";

export function useModal<T>() {
  const [payload, setPayload] = useState<T | null>(null);

  return {
    isOpen: payload !== null,
    payload,
    open: (value: T) => setPayload(value),
    close: () => setPayload(null),
  };
}
