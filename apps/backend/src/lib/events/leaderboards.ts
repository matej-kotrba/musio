import { type FromMessageOnServerByStateType, type LobbyGameState } from "shared";
import { hasAnyPlayerHitPointsLimit, isHost } from "../game/game-utils";
import { changeToLobbyState, getInitialLobbyState, type Lobby } from "../game/lobby";
import { getLobbiesService } from "../game/create";

export function handleLeaderboardsEvent(
  lobby: Lobby<"leaderboard">,
  data: FromMessageOnServerByStateType<"leaderboard">
) {
  const lobbies = getLobbiesService().lobbies;

  switch (data.message.type) {
    case "BACK_TO_LOBBY":
      if (!isHost(data.privateId, lobby)) return;

      const changeToLobbyType: LobbyGameState["type"] = hasAnyPlayerHitPointsLimit(lobby)
        ? "INITIAL"
        : "IN_BETWEEN_ROUNDS";
      const initialData = getInitialLobbyState(changeToLobbyType);
      console.log("🚀 ~ changeToLobbyType:", changeToLobbyType);

      changeToLobbyState(lobby, lobbies, initialData);

      break;
  }
}
