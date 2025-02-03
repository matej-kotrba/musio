import BackgroundEffect from "~/components/landing-page/background-effect/BackgroundEffect";
import Hero from "~/components/landing-page/Hero";

export default function Home() {
  return (
    <div class="min-h-screen bg-[#292929] text-white overflow-hidden relative">
      <main>
        <BackgroundEffect />
        <Hero />
      </main>
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

// function HowToPlayComponent() {
//   const [getCoords, setCoords] = createSignal<{ x: number; y: number }>({ x: 0, y: 0 });
//   let sectionRef!: HTMLElement;

//   const handleMouseMove = (e: MouseEvent) => {
//     if (!sectionRef) return;

//     setCoords({ x: e.x, y: e.y });
//   };

//   createEffect(() => {
//     window.addEventListener("mousemove", handleMouseMove);

//     onCleanup(() => {
//       window.removeEventListener("mousemove", handleMouseMove);
//     });
//   });

//   return (
//     <section
//       ref={sectionRef!}
//       class="isolate"
//       style={{ "--x": `${getCoords().x}px`, "--y": `${getCoords().y}px` }}
//     >
//       <h2 class="text-foreground text-left text-transparent mb-2">
//         <span class="text-6xl mr-2" style={{ "-webkit-text-stroke": "1px hsl(var(--foreground))" }}>
//           01
//         </span>
//         <span class="text-4xl text-foreground">How to play</span>
//       </h2>
//       <div class={`grid grid-cols-4 gap-2`}>
//         <HowToPlayStep stepIndex={1} title="Host or join">
//           Pick one of vast pallette endearing animal avatars, choose your name and head into lobby
//           via hosting it or joining existing one.
//         </HowToPlayStep>
//         <HowToPlayStep stepIndex={2} title="Picking phase">
//           First part of the game is picking a song for others to guess, you are able to listen to
//           your selection and change its name before submitting it.
//         </HowToPlayStep>
//         <HowToPlayStep stepIndex={3} title="Guessing phase">
//           Next ahead is guessing phase, here selected songs are about to take turns for everyone
//           (except the one who chose it) to guess, doing so will grant them points necessary to win,
//           speed is the key here!
//         </HowToPlayStep>
//         <HowToPlayStep stepIndex={4} title="Leaderboards">
//           After guessing phase you'll be able to see overall leaderboards, either some of the
//           players hit the points goal and final leaderboards are shown or next round will take
//           place.
//         </HowToPlayStep>
//         <HowToPlayStep stepIndex={5} title="Repeat">
//           If no-one hit the points goal, next round starts, repeating all the previous steps until
//           on of the animals becomes the ULTIMATE MUSIER!
//         </HowToPlayStep>
//       </div>
//     </section>
//   );
// }

// type HowToPlayStepProps = {
//   stepIndex: number;
//   title: string;
//   children: JSX.Element;
//   class?: string;
// };

// function HowToPlayStep(props: HowToPlayStepProps) {
//   return (
//     <div
//       class={clsx(
//         `${index["how-to-play__container"]} relative rounded-sm w-full p-4 text-foreground aspect-[3/2] bg-background-DEAFULT shadow-md`,
//         props.class
//       )}
//     >
//       <div>
//         <div
//           class={`relative font-bold text-xl mb-2 before:content-[''] before:w-3/4 before:absolute before:top-full before:left-1/2 before:-translate-x-1/2
//           before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-primary before:to-transparent`}
//         >
//           {props.stepIndex}. {props.title}
//         </div>
//         <div class="text-balance">{props.children}</div>
//       </div>
//     </div>
//   );
// }
