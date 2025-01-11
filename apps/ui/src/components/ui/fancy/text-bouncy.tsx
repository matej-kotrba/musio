import { Index } from "solid-js";
import { Motion } from "solid-motionone";

type Props = {
  text: string;
  class?: string;
};

export default function TextBouncy(props: Props) {
  return (
    <div class="flex">
      <Index each={props.text.split("")}>
        {(letter, index) => (
          <Motion
            animate={{ y: [0, 0, 0, 0, -15, 0, 0, 0, 0] }}
            initial={{ y: 0 }}
            transition={{
              duration: 2,
              delay: 1 + index / 50,
              easing: "ease-out",
              repeat: Infinity,
            }}
            exit={{
              scale: 0,
            }}
            class={props.class}
          >
            {letter() === " " ? "\u00A0" : letter()}
          </Motion>
        )}
      </Index>
    </div>
  );
}
