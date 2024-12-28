import { Accessor, createContext, createSignal, JSXElement } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

export type GlobalsContext = {
  volume: number;
};

export const GlobalsContext = createContext<{
  volumeInPercantage: Accessor<number>;
  setVolumeInPercantage: SetStoreFunction<number>;
}>();

export function GlobalsContextProvider(props: { children: JSXElement }) {
  const [volume, setVolume] = createSignal<number>(50);

  return (
    <GlobalsContext.Provider
      value={{ volumeInPercantage: volume, setVolumeInPercantage: setVolume }}
    >
      {props.children}
    </GlobalsContext.Provider>
  );
}
