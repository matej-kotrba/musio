import {
  createNewMessageToClient,
  toPayloadToClient,
  type FromMessageOnServerByStateType,
  type GuessingGameState,
  type SongWithNameHidden,
} from "shared";
import {
  changeLobbyStateOnServer,
  changeToLobbyState,
  getInitialGuessingGameState,
  getInitialLeaderboardsGameState,
  isLobbyState,
  type Lobby,
} from "../game/lobby";
import { getPlayerByPrivateId } from "../game/player";
import { createNewSong, getLobbiesService, type LobbiesMap } from "../game/create";
import {
  DELAY_BETWEEN_SONGS_IN_MS,
  INITIAL_GUESSING_DELAY_IN_MS,
  SONG_PICKING_DURATION_IN_SEC,
} from "../common/constants";
import { normalizeString, waitFor, abortLobbyTimeoutSignalAndRemoveIt } from "../common/utils";

export function handlePickingEvent(
  lobby: Lobby<"picking">,
  data: FromMessageOnServerByStateType<"picking">
) {
  const lobbies = getLobbiesService().lobbies;

  switch (data.message.type) {
    case "PICK_SONG":
      const player = getPlayerByPrivateId(lobby, data.privateId);
      const { name, artist, trackUrl, imageUrl100x100, iTunesUrl } = data.message.payload;

      if (!player) return;
      if (lobby.stateProperties.playersWhoPickedIds.includes(data.privateId)) return;

      const newSong = createNewSong(
        normalizeString(name),
        artist,
        trackUrl,
        imageUrl100x100,
        iTunesUrl,
        player.publicId
      );

      lobby.data.pickedSongs.push(newSong);

      if (lobby.data.pickedSongs.length === lobby.players.length)
        changeToGuessingGameLobbyState(lobby, lobbies);
      else {
        lobbies.broadcast(
          lobby.id,
          toPayloadToClient(
            player.publicId,
            createNewMessageToClient(lobby.id, "PLAYER_PICKED_SONG", {})
          )
        );
      }

      break;
  }
}

export function changeToGuessingGameLobbyState(lobby: Lobby, lobbies: LobbiesMap) {
  changeToLobbyState(lobby, lobbies, getInitialGuessingGameState(lobby.data.pickedSongs), () => {
    runGuessingSongQueue(lobbies, lobby.id, {
      initialDelay: INITIAL_GUESSING_DELAY_IN_MS,
    });
  });
}

async function runGuessingSongQueue(
  lobbies: LobbiesMap,
  lobbyId: string,
  { initialDelay = 5000 }: { initialDelay?: number }
) {
  const lobby = lobbies.get(lobbyId);
  if (!lobby || lobby.stateProperties.state !== "guessing") return;

  lobby.stateProperties.isGuessingPaused = true;
  await waitFor(initialDelay);
  lobby.stateProperties.isGuessingPaused = false;

  lobby.data.songQueueGenerator = handleSongInQueue(lobbies, lobby);

  while (true) {
    const { value: currentIndex } = lobby.data.songQueueGenerator.next();
    if (currentIndex === undefined) break;

    lobby.data.currentSongIndex = currentIndex;

    abortLobbyTimeoutSignalAndRemoveIt(lobby);
    resetGuessingState(lobby.stateProperties);
    setPlayerWhoPickedSongToStateProperties(lobby, currentIndex);
    lobby.data.currentTimeoutAbortController = new AbortController();

    await waitFor(
      SONG_PICKING_DURATION_IN_SEC * 1000,
      lobby.data.currentTimeoutAbortController.signal
    );

    lobbies.broadcast(
      lobby.id,
      toPayloadToClient(
        "server",
        createNewMessageToClient(lobby.id, "IN_BETWEEN_SONGS_DELAY", {
          delay: DELAY_BETWEEN_SONGS_IN_MS,
          correctSongName: lobby.data.songQueue[currentIndex].name,
          songsInQueue: {
            currentIndex: currentIndex,
            songsInQueueByPlayerPublicIds: lobby.data.pickedSongs.map(
              (song) => song.fromPlayerByPublicId
            ),
          },
          pointsPerPlayer: lobby.stateProperties.playersWhoGuessed
            .filter((player) => !!getPlayerByPrivateId(lobby, player.privateId))
            .map((player) => ({
              publicId: getPlayerByPrivateId(lobby, player.privateId)!.publicId,
              points: player.points,
            }))
            .concat(
              getPlayerByPrivateId(lobby, lobby.stateProperties.playerWhoPickedTheSong!.privateId)
                ? [
                    {
                      publicId: getPlayerByPrivateId(
                        lobby,
                        lobby.stateProperties.playerWhoPickedTheSong!.privateId
                      )!.publicId,
                      points: lobby.stateProperties.playerWhoPickedTheSong!.points,
                    },
                  ]
                : []
            ),
        })
      )
    );

    if (isLobbyState(lobby, "guessing")) {
      lobby.stateProperties.isGuessingPaused = true;
      await waitFor(DELAY_BETWEEN_SONGS_IN_MS);
      lobby.stateProperties.isGuessingPaused = false;
    }
  }

  changeLobbyStateOnServer(lobby, getInitialLeaderboardsGameState(lobby.data.pickedSongs));
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

function* handleSongInQueue(lobbies: LobbiesMap, lobby: Lobby) {
  let currentSongIndex = 0;

  while (currentSongIndex < lobby.data.songQueue.length) {
    const song = lobby.data.songQueue[currentSongIndex];
    if (!song) return;

    lobbies.broadcast(
      lobby.id,
      toPayloadToClient(
        "server",
        createNewMessageToClient(lobby.id, "NEW_SONG_TO_GUESS", {
          song: {
            ...song,
            name: transformSongNameToHidden(song.name),
          },
          initialTimeRemaining: SONG_PICKING_DURATION_IN_SEC,
        })
      )
    );

    yield currentSongIndex++;
  }
}

function transformSongNameToHidden(str: string): SongWithNameHidden["name"] {
  return str.split(" ").map((word) => Array.from({ length: word.length }, () => null));
}

function resetGuessingState(stateProperties: GuessingGameState) {
  stateProperties.playersWhoGuessed = [];
  stateProperties.startTime = Date.now();
  delete stateProperties.playerWhoPickedTheSong;
}

function setPlayerWhoPickedSongToStateProperties(lobby: Lobby, currentSongIndex: number) {
  const song = lobby.data.songQueue[currentSongIndex];
  const playerWhoPickedSong = lobby.players.find(
    (player) => player.publicId === song.fromPlayerByPublicId
  );
  if (playerWhoPickedSong) {
    (lobby.stateProperties as GuessingGameState).playerWhoPickedTheSong = {
      points: 0,
      privateId: playerWhoPickedSong?.privateId,
    };
  }
}
