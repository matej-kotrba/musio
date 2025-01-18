import { JSXElement } from "solid-js";
import { WsConnectionContextProvider } from "~/contexts/connection";
import { GlobalsContextProvider } from "~/contexts/globals";

type Props = {
  children: JSXElement;
};

export default function LobbyLayout(props: Props) {
  return (
    <GlobalsContextProvider>
      <WsConnectionContextProvider>
        <div class="container mx-auto">
          <div class="rounded-md">{props.children}</div>
        </div>
      </WsConnectionContextProvider>
    </GlobalsContextProvider>
  );
}
