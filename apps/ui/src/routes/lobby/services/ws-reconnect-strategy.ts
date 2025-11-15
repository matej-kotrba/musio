import { StatusCode, StatusCodes } from "shared";

type ReconnectStrategyData = {
  wsProtocol: "ws" | "wss";
  serverAddress: string;
  lobbyId: string;
  player: {
    name: string;
    icon: string;
  };
};

export class ReconnectStrategy {
  private currentAttempt = 0;
  private delayBetweenRetriesInMs = 500;

  constructor(private data: ReconnectStrategyData, private maxAttempts: number) {}

  public async startWsConnectionAsync(
    onOpen: (ws: WebSocket) => void,
    onMessage: (e: MessageEvent) => void,
    onClose: (e: CloseEvent, retry: () => ReturnType<typeof this.startWsConnectionAsync>) => void,
    onDefect: (message: string) => void
  ): Promise<unknown> {
    try {
      const ws = await this.getWs();

      return new Promise((res) => {
        ws.addEventListener("open", () => {
          onOpen(ws);
          // setWs(ws);
          res("done");
        });

        // TODO: Now this listener actives when redirecting from the lobby manually via link
        // figure out a way to do it differently, maybe with error?
        ws.addEventListener("close", (e) => {
          onClose(e, async () => {
            await this.incrementRetries(e.reason);
            return this.startWsConnectionAsync(onOpen, onMessage, onClose, onDefect);
          });
        });
        // const reason = e.reason as StatusCodes;
        // console.log("Connection was closed", reason);

        // // Only do the redirect when the reason is known
        // if (Object.values(StatusCode).includes(reason)) {
        //   navigate(`/?error=${getConnectionCloseErrorBasedOnReason(reason as StatusCodes)}`, {
        //     replace: true,
        //   });
        // }

        ws.onmessage = onMessage;
      });
    } catch (e) {
      onDefect((e as Error).message);
    }
  }

  private async getWs(): Promise<WebSocket> {
    try {
      return new WebSocket(
        `${this.data.wsProtocol}://${this.data.serverAddress}/ws?lobbyId=${this.data.lobbyId}&name=${this.data.player.name}&icon=${this.data.player.icon}`
      );
    } catch (e) {
      console.error("Error opening ws connection");
      await this.incrementRetries("Error opening ws connection");

      return this.getWs();
    }
  }

  private async incrementRetries(errorMessage: string): Promise<void> {
    this.currentAttempt++;
    if (this.currentAttempt >= this.maxAttempts) {
      console.error("Max attempts of ws connection retries reached", errorMessage);
      throw new Error(`Max attempts of ws connection retries reached ${errorMessage}`);
    }
    return this.delay(this.delayBetweenRetriesInMs);
  }

  private async delay(timeInMs: number): Promise<void> {
    return new Promise((res) => setTimeout(() => res(), timeInMs));
  }
}
