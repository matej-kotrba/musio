import styles from "./Nav.module.css";
import { A } from "@solidjs/router";
import { NAV_HEIGHT } from "~/utils/constants";
import Link from "./ui/Link";

export default function Nav() {
  return (
    <header
      style={{ height: NAV_HEIGHT }}
      class={`${styles.nav} sticky top-0 left-0 py-6 px-4 sm:px-6 lg:px-8 z-10`}
    >
      <div class="container mx-auto flex justify-between items-center">
        <A href="/" class="text-2xl font-bold text-primary">
          Musio
        </A>
        <nav class={`hidden md:flex space-x-4`}>
          <Link href="/host" class="text-foreground hover:text-primary transition-colors">
            Host
          </Link>
          <Link href="/join" class="text-foreground hover:text-primary transition-colors">
            Join
          </Link>
          {/* <A href="#" class="text-foreground hover:text-primary transition-colors">
            Host
          </A>
          <A href="#" class="text-foreground hover:text-primary transition-colors">
            Join
          </A> */}
          {/* <img src={"/svgs/logo.svg"} alt="" class="w-16" />
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
        </div> */}
        </nav>
      </div>
    </header>
  );
}
