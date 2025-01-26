import {
  toPayloadToClient,
  createNewMessageToClient,
  type FromMessageOnServerByStateType,
} from "shared";
import { isHost } from "../game";
import {
  changeLobbyState,
  changeToGuessingGameLobbyState,
  getInitialPickingGameState,
  type Lobby,
} from "../lobby";
import { getLobbiesService } from "../create";
import { setTimeout } from "timers/promises";

export function handleLobbyEvent(lobby: Lobby, data: FromMessageOnServerByStateType<"lobby">) {
  data;
  const lobbies = getLobbiesService().lobbies;

  lobby.stateProperties.state;
  if (
    eventsHandleService.isMessageType(lobby.stateProperties.state, parsed.message, "START_GAME")
  ) {
    if (!isHost(parsed.privateId, lobby)) return;
    const initialData = getInitialPickingGameState();
    changeLobbyState(lobby, initialData);

    // After set time, cancel picking phase and swap to guessing phase
    lobby.data.currentTimeoutAbortController = new AbortController();

    setTimeout(initialData.gameState.initialTimeRemainingInSec * 1000, null, {
      signal: lobby.data.currentTimeoutAbortController.signal,
    })
      .then(() => changeToGuessingGameLobbyState(lobbies, lobby))
      .catch((e) => {});

    lobbies.broadcast(
      lobby.id,
      toPayloadToClient(
        "server",
        createNewMessageToClient(lobby.id, "CHANGE_GAME_STATE", {
          properties: lobby.stateProperties,
        })
      )
    );
  }
}
