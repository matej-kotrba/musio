import { type Accessor, createEffect, createSignal } from "solid-js";

export default function usePrevious<T extends unknown>(value: Accessor<T>) {
  const [get, set] = createSignal<T>(value());

  createEffect((prev) => {
    set(() => prev as T);

    return value();
  });

  return get;
}
