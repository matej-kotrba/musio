import { Icon } from "@iconify-icon/solid";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { NAV_HEIGHT } from "~/utils/constants";

export default function LobbyCreator() {
  return (
    <div
      style={{ height: `calc(100vh - ${NAV_HEIGHT})` }}
      class="flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4"
    >
      <div class="w-full max-w-md">
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

        <Tabs defaultValue="create" class="w-full">
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
                <Button class="w-full">
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
                <Button class="w-full">
                  Join Game
                  <Icon icon={"lucide:arrow-right"} class="ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
