import ChatInput from "~/components/lobby/chat/ChatInput";
import styles from "./index.module.css";
import { createSignal } from "solid-js";
import PlayerDisplay, { getAllIcons, Player } from "~/components/lobby/Player";
import WordToGuess from "~/components/lobby/WordToGuess";
import { LOBBY_LAYOUT_HEIGHT, NAV_HEIGHT } from "~/utils/constants";

export default function Lobby() {
  const [players, setPlayers] = createSignal([]);

  const dummy_players: Player[] = [
    {
      id: "1",
      name: "Very Long cool name asd asd asd awsdasd",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
    },
    {
      id: "2",
      name: "Player 2",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
    },
    {
      id: "3",
      name: "Player 3",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
    },
    {
      id: "1",
      name: "Very Long cool name",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
    },
    {
      id: "2",
      name: "Player 2",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
    },
    {
      id: "3",
      name: "Player 3",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
    },
    {
      id: "1",
      name: "Very Long cool name",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
    },
    {
      id: "2",
      name: "Player 2",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
    },
    {
      id: "3",
      name: "Player 3",
      icon: getAllIcons()[
        Math.round(Math.random() * (getAllIcons().length - 1))
      ],
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
      class="relative grid grid-cols-[auto,1fr,auto] gap-4"
      style={{
        height: `calc(100vh - ${NAV_HEIGHT} - ${LOBBY_LAYOUT_HEIGHT} * 2 - 2rem)`,
      }}
    >
      <aside
        class={`${styles.aside__scrollbar} relative flex flex-col gap-4 w-80 pr-2 overflow-x-clip h-full overflow-y-auto`}
      >
        {dummy_players.map((item) => (
          <PlayerDisplay {...item} />
        ))}
      </aside>
      <section class="flex flex-col items-center">
        <div class="mb-4">
          <div class="w-64 aspect-square overflow-hidden rounded-md">
            <img src={dummySongImage} alt="Song to guess" class="blur-md" />
          </div>
        </div>
        <WordToGuess wordChars={dummySongName} />
      </section>
      <aside class="w-80">
        <ChatInput />
      </aside>
    </div>
  );
}
