import { type FromMessageOnServerByStateType } from "shared";
import { isHost } from "../game/game-utils";
import { changeToLobbyState, getInitialPickingGameState, type Lobby } from "../game/lobby";
import { getLobbiesService } from "../game/create";
import { setTimeout } from "timers/promises";
import { changeToGuessingGameLobbyState } from "./picking";

export function handleLobbyEvent(
  lobby: Lobby<"lobby">,
  data: FromMessageOnServerByStateType<"lobby">
) {
  const lobbies = getLobbiesService().lobbies;

  lobby.stateProperties.state;
  switch (data.message.type) {
    case "START_GAME":
      if (!isHost(data.privateId, lobby)) return;

      const initialData = getInitialPickingGameState();
      changeToLobbyState(lobby, lobbies, initialData);

      // After set time, cancel picking phase and swap to guessing phase
      lobby.data.currentTimeoutAbortController = new AbortController();

      setTimeout(initialData.gameState.initialTimeRemainingInSec * 1000, null, {
        signal: lobby.data.currentTimeoutAbortController.signal,
      })
        .then(() => changeToGuessingGameLobbyState(lobby, lobbies))
        .catch((e) => {});

      break;
  }
}
