import { Icon } from "@iconify-icon/solid";
import { Motion } from "solid-motionone";

export default function MotionIcon(props: { icon: string }) {
  return (
    <Motion
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.6 }}
      class="grid place-content-center size-4"
    >
      <Icon icon={props.icon} class="text-2xl text-foreground duration-100" />
    </Motion>
  );
}
