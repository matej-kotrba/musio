import { JSX, splitProps } from "solid-js";
import styles from "./Slider.module.css";
import { cn } from "~/libs/cn";

type Props = JSX.InputHTMLAttributes<HTMLInputElement>;

export default function Slider(props: Props) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <input
      type="range"
      class={cn(
        `${styles.slider} w-full block bg-secondary rounded-full h-1 shadow-sm my-4`,
        local.class
      )}
      {...rest}
    />
  );
}
