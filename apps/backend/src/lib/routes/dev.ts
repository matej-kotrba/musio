import type { Hono } from "hono";
import { isDev } from "../common/utils";
import { getLobbiesService } from "../game/create";
import { getReceivedPoints } from "../game/game-utils";

// Dev only endpoints
// ****
export default function setupDevEndpoints(app: Hono) {
  app.get("/getLobbies", (c) => {
    if (isDev()) return c.notFound();

    return c.json([...getLobbiesService().lobbies.keys()]);
  });

  app.get("/purgeLobbies", (c) => {
    if (isDev()) return c.notFound();

    getLobbiesService().lobbies.clear();
    return c.json("Lobbies purged");
  });

  app.get("/getLobby", (c) => {
    if (isDev()) return c.notFound();

    return c.json(getLobbiesService().lobbies.get(c.req.query("lobbyId")!));
  });

  app.get("/calculatePoints", (c) => {
    if (isDev()) return c.notFound();

    return c.json(getReceivedPoints(0, 1737400500295, 1737400499241, 10000));
  });
}
// ****
