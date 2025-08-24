import { For, JSXElement, Show } from "solid-js";
import { GlobalsContextProvider } from "~/contexts/globals";
import { GameStoreProvider, getNewGameStore } from "./lobby/stores/game-store";
import { NAV_HEIGHT } from "~/utils/constants";

type Props = {
  children: JSXElement;
};

export default function LobbyLayout(props: Props) {
  return (
    <div class="relative" style={{ height: `calc(100vh - ${NAV_HEIGHT})` }}>
      <GlobalsContextProvider>
        <GameStoreProvider gameStore={getNewGameStore()}>
          <div class="container mx-auto">{props.children}</div>
        </GameStoreProvider>
      </GlobalsContextProvider>
      <DotsEffect />
    </div>
  );
}

function DotsEffect() {
  return (
    <div class="absolute inset-0 opacity-20 -z-10">
      <For each={Array.from({ length: 50 })}>
        {() => (
          <div
            class="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              "animation-delay": `${Math.random() * 3}s`,
              "animation-duration": `${2 + Math.random() * 2}s`,
            }}
          />
        )}
      </For>
    </div>
  );
}
