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

// import { children, createEffect, createSignal, Index, JSX, onCleanup } from "solid-js";
// import index from "./index.module.css";
// import { Motion } from "solid-motionone";
// import clsx from "clsx";

// export default function Home() {
//   return (
//     <main class="text-center text-gray-700 p-4 container mx-auto">
//       <div class={index.landing}>
//         <div class="py-16">
//           <h1 class={`${index.main__title} text-6xl font-bold mb-1 text-foreground`}>
//             <Motion.div
//               class={`${index.main__title} inline-block`}
//               initial={{ opacity: 0, scale: 0, x: 200 }}
//               animate={{ opacity: 1, scale: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.5, easing: "ease" }}
//             >
//               M
//             </Motion.div>
//             <Index each={"usio".split("")}>
//               {(letter, idx) => (
//                 <Motion.div
//                   class={`${index.main__title} inline-block`}
//                   initial={{ opacity: 0, scale: 0, x: -200 }}
//                   animate={{ opacity: 1, scale: 1, x: 0 }}
//                   transition={{ duration: 0.6, delay: 0.7 + idx * 0.1, easing: "ease" }}
//                 >
//                   {letter()}
//                 </Motion.div>
//               )}
//             </Index>
//           </h1>
//           <p class={`${index.main__description} font-bold text-3xl w-fit mx-auto`}>
//             Ultimate song party guessing game
//           </p>
//         </div>
//         <div
//           class={`${index.host__join} relative mx-auto text-foreground text-2xl font-semibold w-[32rem] h-24 flex bg-background-accent rounded-xl`}
//         >
//           <button type="button" class="grow-[1] hover:grow-[2] duration-150 relative">
//             Host
//           </button>
//           <div
//             class={`${index.host__join__separator} w-1 bg-primary rounded-md h-[120%] translate-y-[-10%]`}
//           ></div>
//           <button type="button" class="grow-[1] hover:grow-[2] duration-150 relative">
//             Join
//           </button>
//         </div>
//       </div>
//       <div class="pb-[8rem]"></div>
//       <HowToPlayComponent />
//       <div class="pb-[200rem]"></div>
//     </main>
//   );
// }
