import { JSXElement } from "solid-js";
import { WsConnectionContextProvider } from "~/contexts/connection";
import { GlobalsContextProvider } from "~/contexts/globals";
import { GameStoreProvider, getNewGameStore } from "./lobby/[id]/stores/game-store";

type Props = {
  children: JSXElement;
};

export default function LobbyLayout(props: Props) {
  return (
    <GlobalsContextProvider>
      <WsConnectionContextProvider>
        <GameStoreProvider gameStore={getNewGameStore()}>
          <div class="container mx-auto">{props.children}</div>
        </GameStoreProvider>
      </WsConnectionContextProvider>
    </GlobalsContextProvider>
  );
}
