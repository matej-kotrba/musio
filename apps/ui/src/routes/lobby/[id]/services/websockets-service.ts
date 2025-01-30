import { ProfileData } from "~/components/lobby/profile/ProfileSelection";

export type WsConnection = {
  ws: WebSocket | undefined;
  href: string;
  lobbyId: string;
  playerId: string;
  onMessage: (event: MessageEvent<string>) => void;
  log: (user: string, ...args: Array<string>) => void;
  clear: () => void;
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
};

export default function useWebsockets() {
  let ws: Maybe<WebSocket> = undefined;

  async function connect(lobbyId: string, data: ProfileData) {
    ws = new WebSocket(
      `ws://localhost:5173/ws?lobbyId=${lobbyId}&name=${data.name}&icon=${data.icon}`
    );

    return new Promise((res) => {
      ws!.addEventListener("open", res);
      ws!.onmessage = onMessage;
    });
  }

  function disconnect() {
    ws?.close();
  }

  return {
    connect,
    disconnect,
    get send() {
      return ws?.send;
    },
  };
  // const wsConnection: Maybe<WsConnection> = {
  //   ws: undefined,
  //   href: `ws://localhost:5173/ws?lobbyId=${newLobbyId}&name=${data.name}&icon=${data.icon}`,
  //   lobbyId: newLobbyId,
  //   onMessage,
  //   log: () => {},
  //   clear: () => {},
  //   send: (data) => ctx.connection.ws?.send(data),
  // };

  // function wsConnect() {
  //   const context = ctx?.connection;
  //   if (!context) return;

  //   if (context.ws) {
  //     context.log("ws", "Closing previous connection before reconnecting…");
  //     context.ws.close();
  //     context.ws = undefined;
  //     context.clear();
  //   }

  //   const pd = profileData();
  //   if (!pd) return;

  //   context.log("ws", "Connecting to", context.href, "…");
  //   const new_ws = new WebSocket(context.href);

  //   new_ws.addEventListener("message", context.onMessage);
  //   new_ws.addEventListener("open", () => {
  //     ctx.setConnection("ws", new_ws);
  //     context.log("ws", "Connected!");
  //   });
  // }
}

const onMessage = (event: MessageEvent<string>) => {
  if (!ctx?.connection) return;

  const data = fromMessageOnClient(event.data);
  console.log(data);

  switch (data.message.type) {
    // TODO: Possible race conditions when handling new player join
    case "PLAYER_INIT": {
      const payload = data.message.payload;
      const allPlayers = payload.allPlayers.map(playerServerToPlayer);
      setPlayers(allPlayers);
      setThisPlayerIds({
        private: payload.thisPlayerPrivateId,
        public: payload.thisPlayerPublicId,
      });

      ctx.setConnection((old) => {
        return {
          ...old,
          playerId: payload.thisPlayerPrivateId,
        };
      });

      break;
    }
    case "PLAYER_JOIN": {
      const payload = data.message.payload;
      setPlayers((old) => [...old, playerServerToPlayer(payload)]);

      break;
    }

    case "CHANGE_GAME_STATE": {
      const payload = data.message.payload;
      setGameState(payload.properties);
      resetPlayerChecks();

      break;
    }

    case "PLAYER_PICKED_SONG": {
      setPlayers((old) =>
        old.map((player) => ({ ...player, isChecked: player.publicId === data.publicId }))
      );

      if (thisPlayerIds()?.public === data.publicId) {
        setDidPick(true);
      }

      break;
    }

    case "PLAYER_REMOVED_FROM_LOBBY": {
      const payload = data.message.payload;

      setPlayers((old) => old.filter((player) => player.publicId !== payload.publicId));
      break;
    }

    case "NEW_SONG_TO_GUESS": {
      const payload = data.message.payload;

      setCurrentSongToGuess(payload.song);
      break;
    }

    case "IN_BETWEEN_SONGS_DELAY": {
      const payload = data.message.payload;
      setCurrentSongToGuess(undefined);
      setPreviousCorrectSongName(payload.correctSongName);
      setGameState((old) => {
        return {
          ...old,
          initialDelay: payload.delay / 1000,
        };
      });

      break;
    }

    case "CHAT_MESSAGE_CONFIRM": {
      const payload = data.message.payload;
      setChatMessages((old) => {
        const idx = old.findIndex((message) => message.id === payload.messageId);
        if (idx !== -1) {
          let newArr = old;
          if (payload.isOk) {
            newArr = old.with(idx, {
              ...old[idx],
              isOptimistic: false,
              guessRelation: payload.type,
            });
          } else {
            newArr = old.filter((_, i) => i !== idx);
          }
          return newArr;
        }
        return old;
      });

      break;
    }

    case "CHAT_MESSAGE": {
      const payload = data.message.payload;

      const sender = players().find((player) => player.publicId === data.publicId);
      if (!sender) break;

      setChatMessages((old) => [
        ...old,
        {
          content: payload.content,
          guessRelation: false,
          senderName: sender.name,
        },
      ]);
      break;
    }

    case "CHANGE_POINTS": {
      const payload = data.message.payload;

      setPlayers((old) =>
        old.map((player) => {
          if (player.publicId === data.publicId) {
            return {
              ...player,
              points: player.points + payload.newPoints,
              previousPoints: player.points,
            };
          }
          return player;
        })
      );
    }
  }
};
