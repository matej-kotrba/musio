import { type FromMessageOnServerByStateType, type PickingGameState } from "shared";
import { isHost } from "../game/game-utils";
import { changeToLobbyState, getInitialPickingGameState, type Lobby } from "../game/lobby";
import { getLobbiesService, type LobbiesMap } from "../game/create";
import { setTimeout } from "timers/promises";
import { changeToGuessingGameLobbyState } from "./picking";

export function handleLobbyEvent(
  lobby: Lobby<"lobby">,
  data: FromMessageOnServerByStateType<"lobby">
) {
  const lobbies = getLobbiesService().lobbies;

  switch (data.message.type) {
    case "START_GAME":
      if (!isHost(data.privateId, lobby)) return;

      if (lobby.stateProperties.type === "INITIAL") resetPlayerPoints(lobby);

      const initialData = getInitialPickingGameState();
      changeToLobbyState(lobby, lobbies, initialData);

      setAbortControllerForPickingPhase(lobbies, lobby, initialData.gameState);

      break;
  }
}

function resetPlayerPoints(lobby: Lobby) {
  lobby.players.map((player) => ({ ...player, points: 0 }));
}

function setAbortControllerForPickingPhase(
  lobbies: LobbiesMap,
  lobby: Lobby,
  gameState: PickingGameState
) {
  // After set time, cancel picking phase and swap to guessing phase
  lobby.data.currentTimeoutAbortController = new AbortController();

  setTimeout(gameState.initialTimeRemainingInSec * 1000, null, {
    signal: lobby.data.currentTimeoutAbortController.signal,
  })
    .then(() => changeToGuessingGameLobbyState(lobby, lobbies))
    .catch((e) => {});
}
