import { fromMessageOnClient } from "shared";
import { playerServerToPlayer } from "~/utils/game/common";
import { useGameStore } from "../stores/game-store";
import { produce } from "solid-js/store";
import toast from "solid-toast";

export const handleOnWsMessage = () => {
  const [gameStore, { actions }] = useGameStore();
  const { setGameStore, resetPlayerChecks, resetGameData } = actions;

  return (event: MessageEvent<string>) => {
    const data = fromMessageOnClient(event.data);
    console.log(data);

    switch (data.message.type) {
      // TODO: Possible race conditions when handling new player join
      case "PLAYER_INIT": {
        const payload = data.message.payload;
        const allPlayers = payload.allPlayers.map(playerServerToPlayer);
        setGameStore("players", allPlayers);
        setGameStore("thisPlayerIds", {
          private: payload.thisPlayerPrivateId,
          public: payload.thisPlayerPublicId,
        });
        setGameStore("gameOptions", payload.gameOptions);
        setGameStore("gameState", payload.gameStateData);
        if (payload.gameStateData) setGameStore("gameState", payload.gameStateData);

        break;
      }

      case "PLAYER_JOIN": {
        const payload = data.message.payload;
        setGameStore("players", gameStore.players.length, playerServerToPlayer(payload));

        break;
      }

      case "PLAYER_DATA_CHANGE": {
        const payload = data.message.payload;

        if (payload.isHost) gameStore.players.forEach((player) => (player.isHost = false));

        setGameStore("players", (player) => player.publicId === data.publicId, {
          ...(payload.status !== undefined ? { status: payload.status } : {}),
          ...(payload.isHost != undefined ? { isHost: payload.isHost } : {}),
        });

        break;
      }

      case "CHANGE_GAME_STATE": {
        const payload = data.message.payload;

        // Could be used to display alert when player did not pick a song but needs a property that is currently not being sent
        // const doesChangeFromPickingToGuessing =
        //   gameStore.gameState?.state === "picking" && payload.properties.state === "guessing";

        setGameStore("gameState", payload.properties);
        resetPlayerChecks();

        if (payload.properties.state === "lobby") resetGameData();
        // if (doesChangeFromPickingToGuessing) console.log(payload.properties);
        break;
      }

      case "CHANGE_GAME_OPTIONS": {
        const payload = data.message.payload;
        if (!!payload.gameLimit) {
          setGameStore("gameOptions", "toPointsLimit", payload.gameLimit);
        }
        if (!!payload.playerLimit) {
          setGameStore("gameOptions", "playerLimit", payload.playerLimit);
        }

        break;
      }

      case "PLAYER_PICKED_SONG": {
        setGameStore("players", (player) => player.publicId === data.publicId, "isChecked", true);
        // setGameStore("players", (old) =>
        //   old.map((player) => ({ ...player, isChecked: player.publicId === data.publicId }))
        // );

        if (gameStore.thisPlayerIds?.public === data.publicId) {
          setGameStore("didPick", true);
        }

        break;
      }

      case "PLAYER_REMOVED_FROM_LOBBY": {
        const payload = data.message.payload;

        setGameStore("players", (players) =>
          players.filter((player) => player.publicId !== payload.publicId)
        );
        // setPlayers((old) => old.filter((player) => player.publicId !== payload.publicId));
        break;
      }

      case "NEW_SONG_TO_GUESS": {
        const payload = data.message.payload;

        setGameStore("currentSongToGuess", payload.song);
        break;
      }

      case "IN_BETWEEN_SONGS_DELAY": {
        const payload = data.message.payload;

        setGameStore("currentSongToGuess", undefined);
        setGameStore("previousSongData", {
          correctSongName: payload.correctSongName,
          pointsPerPlayers: payload.pointsPerPlayer,
        });
        setGameStore("gameState", {
          initialDelay: payload.delay / 1000,
        });
        setGameStore("delaySongProgress", {
          currentIndex: payload.songsInQueue.currentIndex,
          songsInQueueByPlayerPublicIds: payload.songsInQueue.songsInQueueByPlayerPublicIds,
        });

        break;
      }

      case "CHAT_MESSAGE_CONFIRM": {
        const payload = data.message.payload;
        const messageIdx = gameStore.chatMessages.findIndex(
          (message) => message.id === payload.messageId
        );
        setGameStore("chatMessageRateLimitExpiration", payload.rateLimitExpirationTime);
        if (messageIdx !== -1) {
          if (payload.isOk)
            setGameStore(
              "chatMessages",
              messageIdx,
              produce((message) => {
                message.isOptimistic = false;
                message.guessRelation = payload.type;
              })
            );
          else {
            setGameStore("chatMessages", (old) => old.filter((_, i) => i !== messageIdx));
          }
        }
        // let newArr = old;
        // if (payload.isOk) {
        //   newArr = old.with(idx, {
        //     ...old[idx],
        //     isOptimistic: false,
        //     guessRelation: payload.type,
        //   });
        // } else {
        //   newArr = old.filter((_, i) => i !== idx);
        // }
        // return newArr;

        break;
      }

      case "CHAT_MESSAGE": {
        const payload = data.message.payload;

        const sender = gameStore.players.find((player) => player.publicId === data.publicId);
        // const sender = players().find((player) => player.publicId === data.publicId);
        if (!sender) break;

        setGameStore("chatMessages", gameStore.chatMessages.length, {
          content: payload.content,
          guessRelation: false,
          senderName: sender.name,
          senderPublicId: sender.publicId,
        });
        // setChatMessages((old) => [
        //   ...old,
        //   {
        //     content: payload.content,
        //     guessRelation: false,
        //     senderName: sender.name,
        //   },
        // ]);
        break;
      }

      case "CHANGE_POINTS": {
        const payload = data.message.payload;

        payload.forEach(({ publicId, newPoints }) => {
          setGameStore(
            "players",
            (player) => player.publicId === publicId,
            produce((player) => {
              if (newPoints === 0) {
                player.previousPoints = undefined;
                player.points = newPoints;
              } else {
                player.previousPoints = player.points;
                player.points = newPoints;
              }
              // player.points = player.points + newPoints;
            })
          );
        });
        // setPlayers((old) =>
        //   old.map((player) => {
        //     if (player.publicId === data.publicId) {
        //       return {
        //         ...player,
        //         points: player.points + payload.newPoints,
        //         previousPoints: player.points,
        //       };
        //     }
        //     return player;
        //   })
        // );

        break;
      }

      case "ERROR_MESSAGE": {
        const payload = data.message.payload;

        toast.error(payload.errorMessage);
      }
    }
  };
};
