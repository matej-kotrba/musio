import { JSXElement } from "solid-js";

type Props = {
  children: JSXElement;
};

export default function LobbyLayout(props: Props) {
  return (
    <div class="container mx-auto">
      <div class="p-4 bg-background-accent rounded-md">{props.children}</div>
    </div>
  );
}
