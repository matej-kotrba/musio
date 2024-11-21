import styles from "./Nav.module.css";
import { A } from "@solidjs/router";
import musioLogo from "/svgs/logo.svg";

export default function Nav() {
  return (
    <nav class="h-20 flex items-center justify-between px-4 lg:px-8 2xl:px-16">
      <img src={musioLogo} alt="" class="w-16" />
      <div class="flex gap-4">
        <A
          href="/"
          title="Host"
          class={`${styles.link} font-bold text-2xl relative hover:bg-background-accent p-2 rounded-md duration-100`}
        >
          Host
        </A>
        <A
          href="/"
          title="Join"
          class={`${styles.link} font-bold text-2xl relative hover:bg-background-accent p-2 rounded-md duration-100`}
        >
          Join
        </A>
      </div>
    </nav>
  );
}
