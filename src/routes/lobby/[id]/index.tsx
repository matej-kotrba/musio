import { createSignal } from "solid-js";
import PlayerDisplay, { getAllIcons, Player } from "~/components/lobby/Player";
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

  return (
    <div
      class="relative"
      style={{
        height: `calc(100vh - ${NAV_HEIGHT} - ${LOBBY_LAYOUT_HEIGHT} * 2 - 2rem)`,
      }}
    >
      <aside class="relative flex flex-col gap-4 w-80 overflow-x-clip border-r-2 border-white border-opacity-20 h-full overflow-y-auto">
        {dummy_players.map((item) => (
          <PlayerDisplay {...item} />
        ))}
      </aside>
      <section></section>
    </div>
  );
}
