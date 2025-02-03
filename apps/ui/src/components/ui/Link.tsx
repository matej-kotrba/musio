import { A } from "@solidjs/router";
import clsx from "clsx";
import { JSX } from "solid-js";

type Props = JSX.IntrinsicElements["a"] & { href: string };

export default function Link(props: Props) {
  return (
    <A
      href={props.href}
      class={clsx(
        `isolate relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:bg-primary
        before:h-0.5 before:w-full before:scale-x-0 hover:before:scale-x-100 before:origin-right hover:before:origin-left
        before:transition-transform before:duration-300`,
        props.class
      )}
    >
      {props.children}
    </A>
  );
}
