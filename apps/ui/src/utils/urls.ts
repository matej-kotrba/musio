export const getServerURLOrRedirectClient = (): string => {
  if (!isClient()) throw new Error("Can't call getServerURLOrRedirectClient on the server");

  const serverUrl = localStorage.getItem("serverUrl");
  if (!serverUrl) {
    console.log(serverUrl);
    throw window.location.replace("/?noServerUrlSet=true");
  }

  return serverUrl;
};

function isClient() {
  return window !== undefined;
}
