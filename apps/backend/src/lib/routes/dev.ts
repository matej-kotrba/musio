import type { Hono } from "hono";
import { isDev } from "../common/utils";
import { getLobbiesService } from "../game/create";
import { getReceivedPoints } from "../game/game-utils";
import { stringSimilarity } from "string-similarity-js";

// Dev only endpoints
// ****
export default function setupDevEndpoints(app: Hono) {
  isDev() &&
    (() => {
      app.get("/getLobbies", (c) => {
        return c.json([...getLobbiesService().lobbies.keys()]);
      });

      app.get("/purgeLobbies", (c) => {
        getLobbiesService().lobbies.clear();
        return c.json("Lobbies purged");
      });

      app.get("/getLobby", (c) => {
        return c.json(getLobbiesService().lobbies.get(c.req.query("lobbyId")!));
      });

      app.get("/calculatePoints", (c) => {
        return c.json(
          getReceivedPoints({
            guessedPlayersLength: 0,
            guessTimeInMs: 1737400500295,
            guessingStartTimeInMs: 1737400499241,
            guessingTimeLengthInMs: 10000,
            currentPlayerWhoPickedPoints: 0,
          })
        );
      });

      app.get("/getSimilarity", (c) => {
        return c.json(stringSimilarity("adasd", "zicjzxc"));
      });
    })();
}
// ****
