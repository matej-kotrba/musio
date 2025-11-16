import { Motion } from "solid-motionone";

type Props = {
  wordChars: Nullable<string>[][];
};

export default function WordToGuess(props: Props) {
  return (
    <div class="text-2xl md:text-4xl flex gap-4 flex-wrap justify-center">
      {props.wordChars.map((arr) => {
        if (arr.length === 0) return "";

        return (
          <div class="flex gap-[2px] h-[1em]">
            {arr.map((letter) => {
              if (letter !== null) {
                return <span>{letter}</span>;
              } else {
                return (
                  <Motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, easing: "ease", delay: 0.5 + Math.random() }}
                    class="border-b-2 border-white w-[1ch] inline-block"
                  >
                    {" "}
                  </Motion.span>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
