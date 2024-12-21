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
            <span class="border-b-2 border-white w-[1ch] inline-block"> </span>
          );
        }
      })}
    </div>
  );
}
