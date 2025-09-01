import { Accessor, createEffect, createSignal, onMount, Setter } from "solid-js";

export default function useLocalStorage(
  key: string,
  defaultValue?: string
): [Accessor<string | null>, Setter<string | null>] {
  const [value, setValue] = createSignal<null | string>(null);

  onMount(() => {
    const currentValue = localStorage.getItem(key);
    if (!currentValue && defaultValue) localStorage.setItem(key, defaultValue);
    setValue(localStorage.getItem(key));
  });

  createEffect(() => {
    const currentValue = value();
    if (currentValue) {
      localStorage.setItem(key, currentValue);
    } else {
      localStorage.removeItem(key);
    }
  });

  return [value, setValue];
}
