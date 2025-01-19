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
        <div class="container mx-auto">{props.children}</div>
      </WsConnectionContextProvider>
    </GlobalsContextProvider>
  );
}
