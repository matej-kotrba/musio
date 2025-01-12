import { Motion } from "solid-motionone";

type Props = {
  wordChars: (string | null)[];
};

export default function WordToGuess(props: Props) {
  return (
    <div class="text-4xl flex gap-1">
      {props.wordChars.map((char) => {
        if (char === " ") {
          return <span class="inline-block w-[1ch]"></span>;
        } else if (char !== null) {
          return <span>{char}</span>;
        } else {
          return (
            <Motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, easing: "ease", delay: Math.random() }}
              class="border-b-2 border-white w-[1ch] inline-block"
            >
              {" "}
            </Motion.span>
          );
        }
      })}
    </div>
  );
}
