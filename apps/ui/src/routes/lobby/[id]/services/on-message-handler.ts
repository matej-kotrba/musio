import { fromMessageOnClient } from "shared";
import { playerServerToPlayer } from "~/utils/game/common";
import { useGameStore } from "../stores/game-store";
import { produce } from "solid-js/store";

export const handleOnWsMessage = (event: MessageEvent<string>) => {
  const [gameStore, { setGameStore, resetPlayerChecks }] = useGameStore();

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

      // ctx.setConnection((old) => {
      //   return {
      //     ...old,
      //     playerId: payload.thisPlayerPrivateId,
      //   };
      // });

      break;
    }
    case "PLAYER_JOIN": {
      const payload = data.message.payload;
      setGameStore("players", gameStore.players.length, playerServerToPlayer(payload));

      break;
    }

    case "CHANGE_GAME_STATE": {
      const payload = data.message.payload;
      setGameStore("gameState", payload.properties);
      resetPlayerChecks();

      break;
    }

    case "PLAYER_PICKED_SONG": {
      setGameStore("players", (player) => player.publicId === data.publicId, "isChecked", true);
      // setGameStore("players", (old) =>
      //   old.map((player) => ({ ...player, isChecked: player.publicId === data.publicId }))
      // );

      if (gameStore.thisPlayerIds.public === data.publicId) {
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

      setGameStore("currentToGuess", payload.song);
      break;
    }

    case "IN_BETWEEN_SONGS_DELAY": {
      const payload = data.message.payload;
      setGameStore("currentToGuess", undefined);
      setGameStore("previousCorrectSongName", payload.correctSongName);
      setGameStore("gameState", {
        initialDelay: payload.delay / 1000,
      });

      break;
    }

    case "CHAT_MESSAGE_CONFIRM": {
      const payload = data.message.payload;
      const messageIdx = gameStore.chatMessages.findIndex(
        (message) => message.id === payload.messageId
      );
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

      setGameStore(
        "players",
        (player) => player.publicId === data.publicId,
        "points",
        (old) => {
          return old + payload.newPoints;
        }
      );
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
    }
  }
};
