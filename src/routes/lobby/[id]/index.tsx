import styles from "./index.module.css";
import {
  createEffect,
  createSignal,
  onMount,
  Show,
  useContext,
} from "solid-js";
import PlayerDisplay, { getAllIcons, Player } from "~/components/lobby/Player";
import WordToGuess from "~/components/lobby/WordToGuess";
import { LOBBY_LAYOUT_HEIGHT, NAV_HEIGHT } from "~/utils/constants";
import Chat from "~/components/lobby/chat/Chat";
import {
  isWsConnectionContext,
  WsConnectionContext,
  WsContext,
} from "~/contexts/connection";
import { useParams, useNavigate } from "@solidjs/router";
import {
  createNewMessageToServer,
  fromMessage,
  WS_MessageMapServer,
} from "~/utils/game/connection";
import ProfileSelection, {
  ProfileData,
} from "~/components/lobby/profile/ProfileSelection";

export default function Lobby() {
  const [profileData, setProfileData] = createSignal<ProfileData | null>(null);

  const [players, setPlayers] = createSignal([]);

  const params = useParams();
  const navigate = useNavigate();

  const lobbyId = () => params.id;
  const ws = useContext(WsConnectionContext);

  function wsConnect(ctx: WsContext, lobbyId: string) {
    if (ctx.ws) {
      ctx.log("ws", "Closing previous connection before reconnecting…");
      ctx.ws.close();
      ctx.ws = undefined;
      ctx.clear();
    }

    const pd = profileData();
    if (!pd) return;

    ctx.log("ws", "Connecting to", ctx.href, "…");
    const ws = new WebSocket(ctx.href);

    ws.addEventListener("message", ctx.onMessage);
    ws.addEventListener("open", () => {
      ctx.ws = ws;
      ws.send(
        JSON.stringify(
          createNewMessageToServer(lobbyId, "PLAYER_INIT", {
            name: pd.name,
            icon: pd.icon,
          })
        )
      );
      ctx.log("ws", "Connected!");
    });
  }

  function handleProfileSelected(data: ProfileData) {
    setProfileData(data);

    ws?.setConnection({
      ws: undefined,
      href: `/_ws?id=${lobbyId()}`,
      onMessage,
      log: () => {},
      clear: () => {},
      send: (data) => ws.connection.ws?.send(data),
    });

    if (ws && isWsConnectionContext(ws?.connection)) {
      wsConnect(ws?.connection, lobbyId());
    }
  }

  const onMessage = (event: MessageEvent<string>) => {
    const data = fromMessage<WS_MessageMapServer>(event.data);
    console.log(data);
    switch (data.message.type) {
      case "REDIRECT_TO_LOBBY": {
        navigate(`/lobby/${data.message.lobbyId}`, { replace: true });
        break;
      }
      case "PLAYER_INIT": {
        console.log(data.message);
        setPlayers((old) => [...old]);
        break;
      }
    }

    // console.log(event);
    // const { user, message } = event.data.startsWith("{")
    //   ? (JSON.parse(event.data) as { user: string; message: unknown })
    //   : { user: "Kamos", message: event.data };

    // console.log(user, message);
  };

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
    <>
      <ProfileSelection onProfileSelected={handleProfileSelected} />
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
          <Show when={!!profileData()} fallback={<p>Selecting...</p>}>
            {dummy_players.map((item) => (
              <PlayerDisplay maxPoints={100} player={item} />
            ))}
          </Show>
        </aside>
        <Show when={!!profileData()} fallback={<p>Selecting...</p>}>
          <section class="flex flex-col items-center">
            <p class="text-xl mb-4 font-bold opacity-35">Guess the song:</p>
            <div class="mb-4">
              <div class="w-64 aspect-square overflow-hidden rounded-md">
                <img src={dummySongImage} alt="Song to guess" class="blur-md" />
              </div>
            </div>
            <WordToGuess wordChars={dummySongName} />
          </section>
        </Show>
        <aside
          class="h-full max-h-full w-80"
          style={{
            height: "var(--custom-height)",
          }}
        >
          <Show when={!!profileData()} fallback={<p>Selecting...</p>}>
            <Chat />
          </Show>
        </aside>
      </div>
    </>
  );
}
