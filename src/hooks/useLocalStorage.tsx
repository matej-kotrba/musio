import { createEffect, createSignal, onMount } from "solid-js";
import { isServer } from "solid-js/web";

export default function useLocalStorage(key: string) {
  const [value, setValue] = createSignal<null | string>(null);

  onMount(() => {
    if (!isServer) {
      setValue(localStorage.getItem(key ?? null));
    }
  });

  createEffect(() => {
    if (!isServer) {
      const currentValue = value();
      if (currentValue) {
        localStorage.setItem(key, currentValue);
      } else {
        localStorage.removeItem(key);
      }
    }
  });

  return [value, setValue];
}
