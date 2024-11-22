import { JSXElement } from "solid-js";

type Props = {
  children: JSXElement;
};

export default function LobbyLayout(props: Props) {
  return <div class="container mx-auto">{props.children}</div>;
}
