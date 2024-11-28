import styles from "./index.module.css";
import { createSignal } from "solid-js";
import PlayerDisplay, { getAllIcons, Player } from "~/components/lobby/Player";
import WordToGuess from "~/components/lobby/WordToGuess";
import { LOBBY_LAYOUT_HEIGHT, NAV_HEIGHT } from "~/utils/constants";
import Chat from "~/components/lobby/chat/Chat";

export default function Lobby() {
  const [players, setPlayers] = createSignal([]);

  const dummy_players: Player[] = [
    {
      id: "1",
      name: "Very Long cool name asd asd asd awsdasd",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
      points: 100,
    },
    {
      id: "2",
      name: "Player 2",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
      points: 89,
    },
    {
      id: "3",
      name: "Player 3",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
      points: 76,
    },
    {
      id: "1",
      name: "Very Long cool name",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
      points: 67,
    },
    {
      id: "2",
      name: "Player 2",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
      points: 56,
    },
    {
      id: "3",
      name: "Player 3",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
      points: 43,
    },
    {
      id: "1",
      name: "Very Long cool name",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
      points: 39,
    },
    {
      id: "2",
      name: "Player 2",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
      points: 28,
    },
    {
      id: "3",
      name: "Player 3",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
      points: 13,
    },
  ];

  const dummySongName = [
    "R",
    null,
    null,
    null,
    " ",
    null,
    null,
    "t",
    null,
    null,
    "m",
  ];

  const dummySongImage = "/2000x2000bb.jpg";

  return (
    <div
      class="relative grid grid-cols-[auto,1fr,auto] gap-4 h-full max-h-full"
      style={{
        "--custom-height": `calc(100vh - ${NAV_HEIGHT} - ${LOBBY_LAYOUT_HEIGHT} * 2 - 2rem)`,
        height: "var(--custom-height)",
      }}
    >
      <aside
        class={`${styles.aside__scrollbar} relative flex flex-col gap-4 w-80 pr-2 overflow-x-clip h-full overflow-y-auto`}
      >
        {dummy_players.map((item) => (
          <PlayerDisplay maxPoints={100} player={item} />
        ))}
      </aside>
      <section class="flex flex-col items-center">
        <p class="text-xl mb-4 font-bold opacity-35">Guess the song:</p>
        <div class="mb-4">
          <div class="w-64 aspect-square overflow-hidden rounded-md">
            <img src={dummySongImage} alt="Song to guess" class="blur-md" />
          </div>
        </div>
        <WordToGuess wordChars={dummySongName} />
      </section>
      <aside
        class="h-full max-h-full w-80"
        style={{
          height: "var(--custom-height)",
        }}
      >
        <Chat />
      </aside>
    </div>
  );
}
