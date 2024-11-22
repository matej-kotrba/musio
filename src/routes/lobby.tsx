import { JSXElement } from "solid-js";
import { LOBBY_LAYOUT_HEIGHT } from "~/utils/constants";

type Props = {
  children: JSXElement;
};

export default function LobbyLayout(props: Props) {
  return (
    <div class="container mx-auto" style={{ height: LOBBY_LAYOUT_HEIGHT }}>
      <div class="p-4 bg-background-accent rounded-md">{props.children}</div>
    </div>
  );
}
