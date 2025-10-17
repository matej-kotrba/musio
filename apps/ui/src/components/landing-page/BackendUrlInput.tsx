import { Icon } from "@iconify-icon/solid";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  TextField,
  TextFieldDescription,
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "../ui/textfield";
import { A } from "@solidjs/router";
import { Button } from "../ui/button";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { createLocalStorageManager } from "@kobalte/core";
import { useLocalStorage } from "~/hooks";
import { getOptionsForNgrok } from "~/utils/fetch";
import toast from "solid-toast";

export default function BackendUrlInput() {
  return (
    <Alert variant={"warn"} class="bg-background-DEAFULT">
      <AlertTitle class="text-xl leading-10 flex items-center">
        <Icon icon={"lucide:triangle-alert"} class="text-2xl text-warning" />
        <span class="ml-2">Musio is self-hosted</span>
      </AlertTitle>
      <AlertDescription class="text-foreground">
        <p>
          We do provide the unified webapp{" "}
          <span class="text-foreground-muted">(can be self-hosted too)</span> but the server hosting
          is up to you, you can also use Ngrok Secure Tunnel to host from local machine, more info{" "}
          <A
            href="https://github.com/matej-kotrba/musio/tree/main/apps/backend"
            target="_active"
            class="text-blue-500 underline"
          >
            here
          </A>
        </p>
        <div class="h-3"></div>
        <UrlInput />
      </AlertDescription>
    </Alert>
  );
}

function UrlInput() {
  const [inputUrlLocalStorage, setInputUrlLocalStorage] = useLocalStorage("serverUrl");
  const [inputtedUrl, setInputtedUrl] = createSignal<Nullable<string>>(null);
  const [inputtedUrlError, setInputtedUrlError] = createSignal<Maybe<string>>();
  const [isCheckingServer, setIsCheckingServer] = createSignal(false);

  function handleUrlInput(e: InputEvent) {
    const target = e.currentTarget as HTMLInputElement;
    setInputtedUrl(target.value);
  }

  async function handleUrlConfirm(urlToCheck: Nullable<string>) {
    setIsCheckingServer(true);

    if (!urlToCheck) {
      setIncorrectURLError();
      setIsCheckingServer(false);

      return;
    }

    const url = isServerUrlValid(urlToCheck);
    if (!url) {
      setIncorrectURLError();
      setIsCheckingServer(false);

      return;
    }

    const isValid = await checkThatServerUrlIsMusioInstance(url).catch(() => {});
    if (!isValid) {
      setNotMusioServerError();
      setIsCheckingServer(false);

      return;
    }

    setInputUrlLocalStorage(url.origin);
    setIsCheckingServer(false);
    setInputtedUrlError("");
    toast.success("Your server is good to go");
  }

  function isServerUrlValid(urlStr: string): Nullable<URL> {
    try {
      const url = new URL(urlStr);
      return url;
    } catch {
      return null;
    }
  }

  async function checkThatServerUrlIsMusioInstance(url: URL) {
    url.pathname = "/ping";
    const res = await fetch(url, getOptionsForNgrok());
    const data = await res.json();

    return res.status === 200 && data === "Musio server is running";
  }

  function setIncorrectURLError() {
    setInputtedUrlError("Your URL doesn't seem valid 😭");
  }

  function setNotMusioServerError() {
    setInputtedUrlError("Your server doesn't seem to work correctly 😭");
  }

  function clearServerUrl() {
    setInputUrlLocalStorage(null);
    setInputtedUrl("");
    toast.success("Server url cleared");
  }

  onMount(() => {
    setInputtedUrl(inputUrlLocalStorage());
  });

  return (
    <TextFieldRoot
      class="w-full"
      validationState={inputtedUrlError() ? "invalid" : "valid"}
      disabled={isCheckingServer()}
    >
      <TextFieldLabel>URL to your server</TextFieldLabel>
      <div class="flex space-x-2 items-center">
        <TextField
          type="text"
          autocomplete="off"
          class="bg-background-DEAFULT border-zinc-600"
          value={inputtedUrl()}
          onInput={handleUrlInput}
        />
        <Button
          type="button"
          variant={"outline"}
          title="Confirm"
          onClick={() => handleUrlConfirm(inputtedUrl())}
          disabled={isCheckingServer()}
        >
          <Icon icon={"charm:tick"} class="text-2xl text-white" />
        </Button>
        <Button
          type="button"
          variant={"outline"}
          title="Clear"
          onClick={clearServerUrl}
          disabled={isCheckingServer()}
        >
          <Icon icon={"iconoir:cancel"} class="text-2xl text-white" />
        </Button>
      </div>
      <TextFieldErrorMessage>{inputtedUrlError()}</TextFieldErrorMessage>
      <Show when={isCheckingServer()}>
        <TextFieldDescription>Checking your server...</TextFieldDescription>
      </Show>
    </TextFieldRoot>
  );
}
