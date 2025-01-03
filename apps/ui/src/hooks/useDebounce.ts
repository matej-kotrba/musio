import { createEffect, createSignal, onCleanup } from "solid-js";

export default function useDebounce<T extends number | string>(
  initialValue: T,
  debounceTimeInMs = 200
) {
  const [value, setValue] = createSignal<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = createSignal<T>(initialValue);

  createEffect(() => {
    // Listen for value changes (it needs to be specified here as solid does not check the context of async calls like setTimeout)
    value();

    const timeout = setTimeout(() => {
      setDebouncedValue(() => value());
    }, debounceTimeInMs);

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });

  return [debouncedValue, setValue];
}
