import { useEffect, useState } from "react";

/** Возвращает значение с задержкой. Нужно для поиска: не дёргать API на каждый символ. */
export const useDebounce = <T>(value: T, delay = 400): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
