import { Icon } from "@iconify-icon/solid";
import { Show } from "solid-js";
import { LeaderboardsEmphasized } from "./leaderboards";
import { Button } from "~/components/ui/button";
import { useGameStore } from "~/routes/lobby/[id]/stores/game-store";
import { useWsConnection } from "~/contexts/wsConnection";
import { toPayloadToServer, createNewMessageToServer } from "shared";

export default function LeaderboardsGamePhase() {
  const [gameStore, { queries }] = useGameStore();
  const { getThisPlayer } = queries;
  const ws = useWsConnection();

  function changeBackToLobby() {
    if (!gameStore.thisPlayerIds?.private) return;

    ws.send?.(
      toPayloadToServer(
        gameStore.thisPlayerIds.private,
        createNewMessageToServer(gameStore.lobbyId, "BACK_TO_LOBBY", {})
      )
    );
  }

  return (
    <>
      <div class="px-2 mt-8">
        <Show when={getThisPlayer()?.isHost}>
          <Button class="ml-auto flex items-center gap-1" onClick={changeBackToLobby}>
            <span class="font-bold">Back to lobby</span>{" "}
            <Icon icon="mingcute:repeat-fill" class="text-xl" />
          </Button>
        </Show>
        <LeaderboardsEmphasized players={gameStore.players} />
      </div>
    </>
  );
}
