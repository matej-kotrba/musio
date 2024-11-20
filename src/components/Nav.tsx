import styles from "./Nav.module.css";
import { A } from "@solidjs/router";

export default function Nav() {
  return (
    <nav class="bg-background_accent h-20 flex items-center gap-4 px-4 lg:px-8 2xl:px-16">
      <A
        href="/"
        title="Host"
        class={`${styles.link} font-bold text-2xl relative`}
      >
        Host
      </A>
      <A href="/" title="Join" class="font-bold text-2xl relative">
        Join
      </A>
    </nav>
  );
}
