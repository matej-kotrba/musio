import { redirect, useNavigate } from "@solidjs/router";

export const getServerURLOrRedirectClient = (): string => {
  if (!isClient()) throw new Error("Can't call getServerURLOrRedirectClient on the server");
  const navigate = useNavigate();

  const serverUrl = localStorage.getItem("serverUrl");
  if (!serverUrl) {
    console.log(serverUrl);
    throw navigate("/?noServerUrlSet=true", { replace: true });
  }

  return serverUrl;
};

function isClient() {
  return window !== undefined;
}
