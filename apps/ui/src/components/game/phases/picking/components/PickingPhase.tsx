import {
  createNewMessageToServer,
  GameState,
  ItunesSong,
  PickingGameState,
  ClientPlayer,
  toPayloadToServer,
} from "shared";
import { Show } from "solid-js";
import TextBouncy from "~/components/ui/fancy/text-bouncy";
import SongPicker from "./song-picker/SongPicker";
import Timer from "./timer/Timer";
import { useGameStore } from "~/routes/lobby/stores/game-store";
import { useWsConnection } from "~/contexts/wsConnection";
import { getGamePhaseIfValid } from "~/utils/game/common";

export default function PickingPhase() {
  const [gameStore] = useGameStore();
  const { send } = useWsConnection();

  const handleSongSelection = (selectedSong: ItunesSong) => {
    if (!gameStore.thisPlayerIds) return;

    send?.(
      toPayloadToServer(
        gameStore.thisPlayerIds.private,
        createNewMessageToServer(gameStore.lobbyId, "PICK_SONG", {
          name: selectedSong.trackName,
          artist: selectedSong.artistName,
          trackUrl: selectedSong.previewUrl,
          imageUrl100x100: selectedSong.artworkUrl100,
        })
      )
    );
  };

  const numberOfPlayersWhoPicked = () =>
    gameStore.players.filter((player) => player.isChecked).length;

  return (
    <Show when={getGamePhaseIfValid<PickingGameState>(gameStore.gameState!, "picking")}>
      {(pickingState) => (
        <div class="relative flex flex-col items-center">
          <Show when={!gameStore.didPick}>
            <div class="absolute right-1 top-1">
              Players ready: {numberOfPlayersWhoPicked()}/{gameStore.players.length}
            </div>
          </Show>
          <Timer
            maxTime={pickingState().initialTimeRemainingInSec}
            currentTime={pickingState().initialTimeRemainingInSec}
          />
          <Show
            when={!gameStore.didPick}
            fallback={
              <div class="mt-2">
                <div class="text-center font-bold text-4xl mb-2">
                  {numberOfPlayersWhoPicked()}/{gameStore.players.length}
                </div>
                <TextBouncy text="Waiting for others to pick!" class="font-bold text-2xl" />
              </div>
            }
          >
            <SongPicker onSongSelect={handleSongSelection} />
          </Show>
        </div>
      )}
    </Show>
  );
}
