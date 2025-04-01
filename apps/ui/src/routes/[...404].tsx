import { A } from "@solidjs/router";
import Link from "~/components/ui/Link";

export default function NotFound() {
  return (
    <div class="mt-24">
      <div class="font-bold text-8xl text-center">
        <span class="text-primary">4</span>
        <span>0</span>
        <span class="text-primary">4</span>
      </div>
      <h1 class="font-bold text-2xl text-center">Hmm, this page does not seem to exist 😭</h1>
      <div class="text-center mt-2">
        <Link href="/" class="font-semibold text-lg pb-1">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
