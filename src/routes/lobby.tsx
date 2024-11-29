import { JSXElement } from "solid-js";
import { WsConnectionContextProvider } from "~/contexts/connection";

type Props = {
  children: JSXElement;
};

export default function LobbyLayout(props: Props) {
  return (
    <WsConnectionContextProvider>
      <div class="container mx-auto">
        <div class="p-4 bg-background-accent rounded-md">{props.children}</div>
      </div>
    </WsConnectionContextProvider>
  );
}
