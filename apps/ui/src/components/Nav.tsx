import styles from "./Nav.module.css";
import { A, useLocation } from "@solidjs/router";
import { NAV_HEIGHT } from "~/utils/constants";
import Link from "./ui/Link";
import { Show } from "solid-js";
import LeaveLobby from "~/features/leaveLobby/LeaveLobby";

export default function Nav() {
  const location = useLocation();

  const shouldDisplayGeneralLinks = () => !location.pathname.includes("/lobby/");

  return (
    <header
      style={{ height: NAV_HEIGHT }}
      class={`${styles.nav} sticky top-0 left-0 py-6 px-4 sm:px-6 lg:px-8 z-10`}
    >
      <div class="container mx-auto flex justify-between items-center">
        <A href="/" class="text-2xl font-bold text-primary">
          Musio
        </A>
        <Show when={shouldDisplayGeneralLinks()} fallback={<LeaveLobby />}>
          <nav class={`hidden md:flex space-x-4`}>
            <Link
              href="/lobby-creator?action=create"
              class="text-foreground hover:text-primary transition-colors"
            >
              Host
            </Link>
            <Link
              href="/lobby-creator?action=join"
              class="text-foreground hover:text-primary transition-colors"
            >
              Join
            </Link>
          </nav>
        </Show>
      </div>
    </header>
  );
}
