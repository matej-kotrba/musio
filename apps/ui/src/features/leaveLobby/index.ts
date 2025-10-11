import { LOBBY_ID_COOKIE, PRIVATE_ID_COOKIE } from "shared";

export function leaveLobby() {
  window.location.replace("/?leftLobby=true");
  // document.cookie = `${LOBBY_ID_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  // document.cookie = `${PRIVATE_ID_COOKIE}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
