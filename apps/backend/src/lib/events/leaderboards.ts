import { type FromMessageOnServerByStateType } from "shared";
import { isHost } from "../game/game-utils";
import {
  changeToLobbyState,
  getInitialLobbyState,
  getInitialPickingGameState,
  type Lobby,
} from "../game/lobby";
import { getLobbiesService } from "../game/create";
import { setTimeout } from "timers/promises";
import { changeToGuessingGameLobbyState } from "./picking";

export function handleLeaderboardsEvent(
  lobby: Lobby<"leaderboard">,
  data: FromMessageOnServerByStateType<"leaderboard">
) {
  const lobbies = getLobbiesService().lobbies;

  switch (data.message.type) {
    case "BACK_TO_LOBBY":
      if (!isHost(data.privateId, lobby)) return;

      const initialData = getInitialLobbyState();
      changeToLobbyState(lobby, lobbies, initialData);

      break;
  }
}
