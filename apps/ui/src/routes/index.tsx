import { Title } from "@solidjs/meta";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { onMount } from "solid-js";
import toast from "solid-toast";
import BackgroundNetEffect from "~/components/landing-page/background-effect/BackgroundNetEffect";
import Footer from "~/components/landing-page/Footer";
import Hero from "~/components/landing-page/Hero";
import HowToPlay from "~/components/landing-page/how-to-play/HowToPlay";
import BackendAccessibilityDisplay from "~/features/checkBackendAccessibility/components/BackendAccessibilityDisplay";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  onMount(() => {
    if (searchParams.leftLobby) {
      toast.success("You have successfully left the lobby.");
      setSearchParams({ leftLobby: null });
    }

    if (searchParams.noServerUrlSet) {
      toast.error("You have to set server's url first.");
      setSearchParams({ noServerUrlSet: null });
    }

    if (searchParams.invalidServerUrl) {
      toast.error("Your server url doesn't seem to work.");
      setSearchParams({ invalidServerUrl: null });
      localStorage.removeItem("serverUrl");
    }

    if (searchParams.error) {
      toast.error(searchParams.error);
      setSearchParams({ error: null });
    }
  });

  return (
    <div class="min-h-screen bg-background-DEAFULT text-foreground overflow-hidden relative">
      <BackgroundNetEffect />
      <main class="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <div class="mt-32"></div>
        <HowToPlay />
      </main>
      <div class="mt-16"></div>
      <Footer />
    </div>
  );
}
