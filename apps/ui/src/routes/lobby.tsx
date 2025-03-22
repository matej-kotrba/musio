import { JSXElement } from "solid-js";
import { GlobalsContextProvider } from "~/contexts/globals";
import { GameStoreProvider, getNewGameStore } from "./lobby/stores/game-store";

type Props = {
  children: JSXElement;
};

export default function LobbyLayout(props: Props) {
  return (
    <GlobalsContextProvider>
      <GameStoreProvider gameStore={getNewGameStore()}>
        <div class="container mx-auto">{props.children}</div>
      </GameStoreProvider>
    </GlobalsContextProvider>
  );
}
