import {
  createNewMessageToClient,
  gameLimitSchema,
  playerLimitSchema,
  toPayloadToClient,
  type FromMessageOnServerByStateType,
  type GameOptions,
  type PickingGameState,
  type ClientPlayerFromServer,
} from "shared";
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
      if (!isEnoughPlayersToStartGame(lobby)) return;

      if (lobby.stateProperties.type === "INITIAL") resetPlayerPoints(lobbies, lobby);

      const initialData = getInitialPickingGameState();
      changeToLobbyState(lobby, lobbies, initialData);

      setAbortControllerForPickingPhase(lobbies, lobby, initialData.gameState);

      break;
    case "CHANGE_GAME_OPTIONS":
      if (!isHost(data.privateId, lobby)) return;
      if (lobby.stateProperties.type !== "INITIAL") return;

      const { newGameLimit, newPlayerLimit } = data.message.payload;
      if (!newGameLimit || !gameLimitSchema.safeParse(newGameLimit).success) return;
      if (!newPlayerLimit || !playerLimitSchema.safeParse(newPlayerLimit).success) return;

      lobby.options.toPointsLimit = newGameLimit;
      lobby.options.playerLimit = newPlayerLimit;
      notifyPlayersOfGameOptionsChange(lobbies, lobby, lobby.options);

      break;
  }
}

function isEnoughPlayersToStartGame(lobby: Lobby) {
  return lobby.players.length;
}

function resetPlayerPoints(lobbies: LobbiesMap, lobby: Lobby) {
  lobby.players.forEach((player) => {
    player.points = 0;
  });
  notifyPlayersOfResettingPoints(lobbies, lobby);
}

function notifyPlayersOfResettingPoints(lobbies: LobbiesMap, lobby: Lobby) {
  lobbies.broadcast(
    lobby.id,
    toPayloadToClient(
      "server",
      createNewMessageToClient(
        lobby.id,
        "CHANGE_POINTS",
        lobby.players.map((player) => ({
          newPoints: 0,
          publicId: player.publicId,
        }))
      )
    )
  );
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

function notifyPlayersOfGameOptionsChange(
  lobbies: LobbiesMap,
  lobby: Lobby,
  gameOptions: Partial<GameOptions>
) {
  lobbies.broadcast(
    lobby.id,
    toPayloadToClient(
      "server",
      createNewMessageToClient(lobby.id, "CHANGE_GAME_OPTIONS", {
        gameLimit: gameOptions.toPointsLimit,
        playerLimit: gameOptions.playerLimit,
      })
    )
  );
}
