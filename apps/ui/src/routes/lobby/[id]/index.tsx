import styles from "./index.module.css";
import { createSignal, Show, useContext, onCleanup } from "solid-js";
import PlayerDisplay, { getAllIcons } from "~/components/lobby/Player";
import WordToGuess from "~/components/lobby/WordToGuess";
import { LOBBY_LAYOUT_HEIGHT, NAV_HEIGHT } from "~/utils/constants";
import Chat from "~/components/lobby/chat/Chat";
import {
  isWsConnectionContext,
  WsConnectionContext,
  WsContext,
} from "~/contexts/connection";
import { useParams, useNavigate } from "@solidjs/router";
import ProfileSelection, {
  ProfileData,
} from "~/components/lobby/profile/ProfileSelection";
import {
  createNewMessageToServer,
  fromMessage,
  toPayloadToServer,
} from "shared";
import { getLobbyURL as getLobbyId } from "~/utils/rscs";
import { Player, WS_MessageMapServer } from "shared/index.types";
import { playerServerToPlayer } from "~/utils/game/common";

export default function Lobby() {
  const [profileData, setProfileData] = createSignal<ProfileData | null>(null);

  const [players, setPlayers] = createSignal<Player[]>([]);

  const params = useParams();
  const navigate = useNavigate();

  const lobbyId = () => params.id;
  const ctx = useContext(WsConnectionContext);

  // onCleanup(() => {
  //   removeLobbyWhenEmpty(lobbyId());
  // });

  function wsConnect() {
    const context = ctx?.connection;
    if (!context) return;

    if (context.ws) {
      context.log("ws", "Closing previous connection before reconnecting…");
      context.ws.close();
      context.ws = undefined;
      context.clear();
    }

    const pd = profileData();
    if (!pd) return;

    context.log("ws", "Connecting to", context.href, "…");
    const new_ws = new WebSocket(context.href);

    new_ws.addEventListener("message", context.onMessage);
    new_ws.addEventListener("open", () => {
      ctx.setConnection("ws", new_ws);
      context.log("ws", "Connected!");
    });
  }

  async function handleProfileSelected(data: ProfileData) {
    setProfileData(data);
    const newLobbyId = await getLobbyId(lobbyId());
    if (newLobbyId !== lobbyId()) {
      navigate(`/lobby/${newLobbyId}`, { replace: true });
    }

    ctx?.setConnection({
      ws: undefined,
      href: `ws://localhost:5173/ws?lobbyId=${newLobbyId}&name=${data.name}&icon=${data.icon}`,
      lobbyId: newLobbyId,
      onMessage,
      log: () => {},
      clear: () => {},
      send: (data) => ctx.connection.ws?.send(data),
    });

    if (ctx && isWsConnectionContext(ctx?.connection)) {
      wsConnect();
    }
  }

  const onMessage = (event: MessageEvent<string>) => {
    if (!ctx?.connection) return;

    const data = fromMessage<WS_MessageMapServer>(event.data);
    console.log(data);
    switch (data.message.type) {
      // TODO: Possible race conditions when handling new player join
      case "PLAYER_INIT": {
        const payload = data.message.payload;
        const allPlayers = payload.allPlayers.map(playerServerToPlayer);
        setPlayers(allPlayers);

        ctx.setConnection((old) => {
          return {
            ...old,
            playerId: payload.id,
          };
        });

        ctx.connection.ws?.send(
          toPayloadToServer(
            ctx.connection.playerId,
            createNewMessageToServer(ctx.connection.playerId, "PICK_SONG", {
              lobbyId: ctx.connection.lobbyId,
              song: "Love to Lose",
            })
          )
        );

        break;
      }
      case "PLAYER_JOIN": {
        const payload = data.message.payload;
        setPlayers((old) => [...old, playerServerToPlayer(payload)]);

        break;
      }

      case "CHANGE_GAME_STATE": {
        console.log(data.message.payload);
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
            {players().map((item) => (
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
