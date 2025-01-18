import styles from "./Nav.module.css";
import { A } from "@solidjs/router";
import { NAV_HEIGHT } from "~/utils/constants";

export default function Nav() {
  return (
    <div class={`${styles.nav}  sticky top-0 left-0 z-[10]`}>
      <nav class={`container flex items-center justify-between`} style={{ height: NAV_HEIGHT }}>
        <img src={"/svgs/logo.svg"} alt="" class="w-16" />
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
    </div>
  );
}
