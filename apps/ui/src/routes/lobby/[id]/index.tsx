import { createSignal, Show, Switch, Match, createEffect, onCleanup } from "solid-js";
import { LOBBY_LAYOUT_HEIGHT, NAV_HEIGHT } from "~/utils/constants";
import { useParams, useNavigate } from "@solidjs/router";
import { getLobbyURL as getLobbyId } from "~/utils/rscs";
import {
  GuessingGameState,
  ItunesSong,
  PickingGameState,
  Player,
  Song,
  SongWithNameHidden,
} from "shared/index.types";
import { Button } from "~/components/ui/button";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { useCopyToClipboard } from "~/hooks";
import { Icon } from "@iconify-icon/solid";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import TextBouncy from "~/components/ui/fancy/text-bouncy";
import useWebsocket from "./services/websockets-service";
import { useGameStore, getNewGameStore } from "./stores/game-store";
import { getAllIcons, PlayerToDisplay } from "~/components/game/Player";
import ProfileSelection, { ProfileData } from "~/components/game/profile/ProfileSelection";
import PlayerList from "~/components/game/phases/shared/player-list/PlayerList";
import { toPayloadToServer, createNewMessageToServer } from "shared";
import { LeaderboardsEmphasized } from "~/components/game/phases/leaderboards/components/leaderboards";
import SongPicker from "~/components/game/phases/picking/components/song-picker/SongPicker";
import Timer from "~/components/game/phases/picking/components/timer/Timer";
import WordToGuess from "~/components/game/WordToGuess";
import { handleOnWsMessage } from "./services/on-message-handler";
import { WsConnectionProvider } from "~/contexts/wsConnection";
import WaitingLobby from "~/components/game/phases/lobby/components/WaitingLobby";
import PickingPhase from "~/components/game/phases/picking/components/PickingPhase";
import GuessingGamePhase from "~/components/game/phases/guessing/components/GuessingPhase";

const dummy_players: PlayerToDisplay[] = [
  {
    name: "Very Long cool name asd asd asd awsdasd",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 100,
    isHost: true,
    publicId: "1",
    isChecked: true,
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 89,
    isHost: false,
    publicId: "2",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 76,
    isHost: false,
    publicId: "3",
  },
  {
    name: "Very Long cool name",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 67,
    isHost: false,
    publicId: "4",
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 56,
    isHost: false,
    publicId: "5",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 43,
    isHost: false,
    publicId: "6",
  },
  {
    name: "Very Long cool name",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 39,
    isHost: false,
    publicId: "7",
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 6,
    isHost: false,
    publicId: "8",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 0,
    isHost: false,
    publicId: "9",
  },
];

const dummySongName = ["R", null, null, null, " ", null, null, "t", null, null, "m"];

const dummySongImage = "/2000x2000bb.jpg";

export default function Lobby() {
  const { connect, disconnect, send } = useWebsocket(handleOnWsMessage());
  const [gameStore, { actions }] = useGameStore();
  const { setGameStore } = actions;

  const params = useParams();
  const navigate = useNavigate();

  // const ctx = useContext(WsConnectionContext);

  const [profileData, setProfileData] = createSignal<ProfileData | null>(null);

  const lobbyId = () => params.id;

  onCleanup(() => disconnect());

  async function handleProfileSelected(data: ProfileData) {
    setProfileData(data);
    const newLobbyId = await getLobbyId(lobbyId());
    if (newLobbyId !== lobbyId()) {
      navigate(`/lobby/${newLobbyId}`, { replace: true });
    }

    setGameStore("lobbyId", newLobbyId);
    await connect(newLobbyId, data);
  }

  // const handleChatMessage = (content: string) => {
  //   if (!thisPlayerIds()?.public || !getThisPlayer()) return;

  //   const newMessage: ChatMessage = {
  //     id: createUniqueId(),
  //     content: content,
  //     guessRelation: false,
  //     senderName: getThisPlayer()!.name,
  //     isOptimistic: true,
  //   };

  //   // Optimistically update messages
  //   setChatMessages((old) => [...old, newMessage]);

  //   ctx?.connection.ws?.send(
  //     toPayloadToServer(
  //       thisPlayerIds()!.private,
  //       createNewMessageToServer(lobbyId(), "CHAT_MESSAGE", {
  //         messageId: newMessage.id!,
  //         content,
  //       })
  //     )
  //   );
  // };

  return (
    <WsConnectionProvider wsConnection={{ send }}>
      <ProfileSelection onProfileSelected={handleProfileSelected} />
      <div
        class="relative"
        style={{
          "--custom-height": `calc(100vh - ${NAV_HEIGHT} - ${LOBBY_LAYOUT_HEIGHT} * 2 - 2rem)`,
          height: `calc(var(--custom-height) + ${LOBBY_LAYOUT_HEIGHT} * 2)`,
        }}
      >
        <div class="grid grid-cols-[auto,1fr,auto] gap-4 py-4 overflow-hidden">
          {/* Player sidebar */}
          <PlayerList shouldShow={!!profileData()} />
          {/* ___ */}
          <Switch>
            <Match when={gameStore.gameState.state === "lobby"}>
              <WaitingLobby />
            </Match>
            <Match when={gameStore.gameState.state === "picking"}>
              <PickingPhase />
            </Match>
            <Match when={gameStore.gameState.state === "guessing"}>
              <GuessingGamePhase />
            </Match>
            <Match when={gameState().state === "leaderboard"}>
              <LeaderboardsGamePhase
                players={players()}
                isThisPlayerHost={getThisPlayer()?.isHost}
              />
            </Match>
          </Switch>
          <aside
            class="h-full max-h-full w-80"
            style={{
              height: "var(--custom-height)",
            }}
          >
            <Show when={!!profileData()} fallback={<p>Selecting...</p>}>
              <Chat
                messages={chatMessages()}
                onChatMessage={handleChatMessage}
                disabled={currentSongToGuess()?.fromPlayerByPublicId === thisPlayerIds()?.public}
              />
            </Show>
          </aside>
        </div>
      </div>
    </WsConnectionProvider>
  );
}

// {
//   state: "guessing",
//   initialTimeRemaining: 30,
//   currentInitialTimeRemaining: 30,
//   playersWhoGuessed: [],
//   initialDelay: 5,
//   isGuessingPaused: true,
//   startTime: 0,
// }

// {
//   artist: "TheFatRat",
//   name: [
//     ["N", "o", "b", null, null, null, null],
//     ["C", null, null, null, null, null, null],
//     [null, null],
//     [null, null, null],
//     [null, null, null, null, null],
//   ],
//   fromPlayerByPublicId: "asd",
//   trackUrl:
//     "https://music.apple.com/us/album/monody-feat-laura-brehm-radio-edit/1444888726?i=1444888936&uo=4",
//   imageUrl100x100:
//     "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/f3/69/33/f3693389-7610-f6e0-9767-4b3ba8f61acc/00602557309201.rgb.jpg/100x100bb.jpg",
// }
