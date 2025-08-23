import { createResource, createSignal, Resource } from "solid-js";

export default function useDeferredResource<T, U>(
  callback: (data: U) => Promise<T>
): [(data: U) => void, data: Resource<Maybe<T>>] {
  const [shouldRun, setShouldRun] = createSignal<Maybe<U>>(undefined);
  const [data] = createResource(shouldRun, callback);

  const run = (data: U) => {
    setShouldRun(() => data);
  };

  return [run, data];
}
