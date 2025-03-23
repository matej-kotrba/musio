import { Icon } from "@iconify-icon/solid";
import { action, useIsRouting, useNavigate, useSearchParams } from "@solidjs/router";
import { constructURL, getServerURL } from "shared";
import { createResource, Show } from "solid-js";
import toast from "solid-toast";
import WholePageLoaderFallback from "~/components/common/fallbacks/WholePageLoader";
import Loader from "~/components/common/loader/Loader";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { NAV_HEIGHT } from "~/utils/constants";

const actionQueryParam = "action";
const actionQueryParamValues = { create: "create", join: "join" } as const;
type ActionQueryParamsValue = keyof typeof actionQueryParamValues;

export default function LobbyCreator() {
  const navigate = useNavigate();
  const isRouting = useIsRouting();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleCreateGame() {
    navigate("/lobby", { replace: true });
  }

  const [lobbyIdCheckData, { refetch: refetchLobbyIdCheck }] = createResource(async (_, info) => {
    const lobbyId = info.refetching;
    if (!lobbyId) return;

    await new Promise((res) => setTimeout(() => res(""), 1500));

    const { status } = await fetch(constructURL(getServerURL(), "isLobbyId"));
    if (status === 200) {
      navigate(`/lobby/${lobbyId}`);
    } else {
      toast.error("This code does not seem correct 😭");
    }
  });

  function handleJoinGame() {
    refetchLobbyIdCheck("ahoj");
  }

  const getDefaultTabValue: () => ActionQueryParamsValue = () => {
    if (isValidActionType(searchParams[actionQueryParam])) return searchParams[actionQueryParam];
    else return "create";
  };

  function handleTabChange(actionType: string) {
    if (!isValidActionType(actionType)) return;

    setSearchParams({ [actionQueryParam]: actionType });
  }

  function isValidActionType(actionType: unknown): actionType is ActionQueryParamsValue {
    if (typeof actionType !== "string") return false;

    return !!actionQueryParamValues[actionType as ActionQueryParamsValue];
  }

  return (
    <>
      <Show when={isRouting()}>
        <WholePageLoaderFallback />
      </Show>
      <div
        style={{ height: `calc(100vh - ${NAV_HEIGHT})` }}
        class="flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4"
      >
        <div class="w-full max-w-md">
          <CardHeader />
          <Tabs defaultValue={getDefaultTabValue()} class="w-full" onChange={handleTabChange}>
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Game</TabsTrigger>
              <TabsTrigger value="join">Join Game</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <div class="p-6 border shadow-md rounded-lg">
                <div class="pb-6 space-y-1">
                  <h3 class="text-2xl font-semibold">Create a Game</h3>
                  <p class="text-sm text-foreground-muted">
                    Start a new game lobby for friends to join
                  </p>
                </div>
                <div>
                  <Button class="w-full" onClick={handleCreateGame}>
                    Create Game
                    <Icon icon={"lucide:arrow-right"} class="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="join">
              <div class="p-6 border shadow-md rounded-lg">
                <div class="pb-6 space-y-1">
                  <h3 class="text-2xl font-semibold">Join a Game</h3>
                  <p class="text-sm text-foreground-muted">
                    Enter a game code to join an existing lobby
                  </p>
                </div>
                <div class="pb-4">
                  <TextFieldRoot>
                    <TextField
                      placeholder="Enter game code"
                      maxLength={6}
                      class="text-center text-lg uppercase py-2 border-zinc-600"
                    />
                  </TextFieldRoot>
                </div>
                <div>
                  <Button
                    class="w-full"
                    onClick={handleJoinGame}
                    disabled={lobbyIdCheckData.loading}
                  >
                    Join Game
                    <Icon icon={"lucide:arrow-right"} class="ml-2" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

function CardHeader() {
  return (
    <div class="mb-8 flex flex-col items-center text-center">
      <div class="grid place-content-center rounded-full bg-primary/10 p-4">
        <Icon
          icon={"lucide:music"}
          class="text-2xl text-primary size-8 grid place-content-center"
        />
      </div>
      <h1 class="mt-4 text-3xl font-bold">Game Creator</h1>
      <p class="mt-2 text-foreground-muted">Create a game lobby or join an existing one</p>
    </div>
  );
}
