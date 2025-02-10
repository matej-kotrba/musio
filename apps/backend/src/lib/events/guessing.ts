import {
  createNewMessageToClient,
  messageLengthSchema,
  toPayloadToClient,
  type FromMessageOnServerByStateType,
} from "shared";
import type { Lobby } from "../game/lobby";
import { getPlayerByPrivateId, type PlayerServer } from "../game/player";
import { getReceivedPoints } from "../game/game-utils";
import { getLobbiesService } from "../game/create";
import { stringSimilarity } from "string-similarity-js";
import { handleChatMessage } from "./all";
import { normalizeString } from "../common/utils";

export function handleGuessingEvent(
  lobby: Lobby<"guessing">,
  data: FromMessageOnServerByStateType<"guessing">
) {
  switch (data.message.type) {
    case "CHAT_MESSAGE":
      const STRING_SIMILARITY_THRESHOLD = 0.7;

      const { content, messageId } = data.message.payload;
      const player = getPlayerByPrivateId(lobby, data.privateId);
      const currentSong = lobby.data.songQueue[lobby.data.currentSongIndex];

      if (!player) return;
      if (lobby.stateProperties.isGuessingPaused) return;
      if (messageLengthSchema.safeParse(content).success === false) return;
      if (currentSong.fromPlayerByPublicId === player.publicId) {
        player.ws.send(
          toPayloadToClient(
            "server",
            createNewMessageToClient(lobby.id, "CHAT_MESSAGE_CONFIRM", {
              isOk: false,
              messageId,
              type: false,
            })
          )
        );
        return;
      }

      if (areStringsSame(normalizeString(content), currentSong.name))
        handleGuessWhenSame(lobby, player, messageId);
      else if (areStringSimilarByThreshold(content, currentSong.name, STRING_SIMILARITY_THRESHOLD))
        handleGuessWhenSimilar(lobby, player, messageId);
      else handleChatMessage(player, lobby, { messageId, content });

      break;
  }
}

function areStringsSame(str1: string, str2: string) {
  return str1.toLowerCase() === str2.toLowerCase();
}

function areStringSimilarByThreshold(str1: string, str2: string, threshold: number) {
  return stringSimilarity(str1, str2) >= threshold;
}

function handleGuessWhenSame(lobby: Lobby<"guessing">, player: PlayerServer, messageId: string) {
  const pointsToReceive = getReceivedPoints({
    guessedPlayersLength: lobby.stateProperties.playersWhoGuessed.length,
    guessTimeInMs: Date.now(),
    guessingStartTimeInMs: lobby.stateProperties.startTime,
    guessingTimeLengthInMs: lobby.stateProperties.initialTimeRemaining * 1000,
    currentPlayerWhoPickedPoints: lobby.stateProperties.playerWhoPickedTheSong!.points,
  });

  // Assign points to current guess stats
  lobby.stateProperties.playersWhoGuessed.push({
    privateId: player.privateId,
    points: pointsToReceive.forGuesser,
  });
  lobby.stateProperties.playerWhoPickedTheSong!.points += pointsToReceive.forPlayerWhoPicked;

  // Assign points to player on server
  player.points += pointsToReceive.forGuesser;
  const playerWhoPickedSong = getPlayerByPrivateId(
    lobby,
    lobby.stateProperties.playerWhoPickedTheSong!.privateId
  );
  if (playerWhoPickedSong) playerWhoPickedSong.points += pointsToReceive.forPlayerWhoPicked;

  getLobbiesService().lobbies.broadcast(
    lobby.id,
    toPayloadToClient(
      player.publicId,
      createNewMessageToClient(lobby.id, "CHANGE_POINTS", [
        {
          publicId: player.publicId,
          newPoints: player.points,
        },
        ...(playerWhoPickedSong
          ? [
              {
                publicId: playerWhoPickedSong.publicId,
                newPoints: playerWhoPickedSong.points,
              },
            ]
          : []),
      ])
    )
  );

  player.ws.send(
    toPayloadToClient(
      "server",
      createNewMessageToClient(lobby.id, "CHAT_MESSAGE_CONFIRM", {
        isOk: true,
        type: "guessed",
        messageId,
      })
    )
  );

  if (shouldAbortGuessTimeout(lobby)) lobby.data.currentTimeoutAbortController?.abort();
}

function shouldAbortGuessTimeout(lobby: Lobby<"guessing">) {
  return (
    // Check for length just for debugging purposes, none will be able to play the game alone
    // but in dev you can test the picking phase... with it
    lobby.players.length > 1 &&
    lobby.stateProperties.playersWhoGuessed.length === lobby.players.length - 1
  );
}

function handleGuessWhenSimilar(lobby: Lobby<"guessing">, player: PlayerServer, messageId: string) {
  player.ws.send(
    toPayloadToClient(
      "server",
      createNewMessageToClient(lobby.id, "CHAT_MESSAGE_CONFIRM", {
        isOk: true,
        type: "near",
        messageId,
      })
    )
  );
}
