import { Icon } from "@iconify-icon/solid";
import { A } from "@solidjs/router";

export default function Footer() {
  return (
    <footer class="bg-[#1a1a1a] text-foreground py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-primary">Musio</h3>
            <p class="text-sm text-foreground/75">
              Turning parties into unforgettable music experiences since 2025.
            </p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li>
                <A
                  href="#features"
                  class="text-foreground/75 hover:text-primary transition-colors duration-300"
                >
                  Host
                </A>
              </li>
              <li>
                <A
                  href="#how-it-works"
                  class="text-foreground/75 hover:text-primary transition-colors duration-300"
                >
                  Join
                </A>
              </li>
            </ul>
          </div>
          <div></div>
          <div>
            <h4 class="text-lg font-semibold mb-4">Created by</h4>
            <div>
              <span class="font-bold text-foreground">Matěj Kotrba</span>
              <span> with 🦭</span>
            </div>
            <div class="flex space-x-2">
              <a
                href="https://github.com/matej-kotrba"
                target="_blank"
                rel="noopener noreferrer"
                class="text-foreground/75 hover:text-primary transition-colors duration-300"
              >
                <Icon icon="mdi:github" class="text-3xl" />
                <span class="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/matej-kotrba/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-foreground/75 hover:text-primary transition-colors duration-300"
              >
                <Icon icon="mdi:linkedin" class="text-3xl" />
                <span class="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
