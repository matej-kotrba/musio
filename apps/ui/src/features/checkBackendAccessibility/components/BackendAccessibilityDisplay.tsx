import { Icon } from "@iconify-icon/solid";
import { constructURL } from "shared";
import { createSignal, ErrorBoundary, onMount, Show } from "solid-js";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { getServerURLOrRedirectClient } from "~/utils/urls";

const pingServerUrl = () => constructURL(getServerURLOrRedirectClient(), "ping");

async function pingBackend() {
  const response = await fetch(pingServerUrl(), {
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  });
  return response.status;
}

export default function BackendAccessibilityDisplay() {
  const [pingServerStatus, setPingServerStatus] = createSignal<Maybe<number>>();

  onMount(() => pingBackend().then(setPingServerStatus));

  return (
    <ErrorBoundary fallback={<ServicesDownAlert />}>
      <Show when={pingServerStatus() && pingServerStatus() !== 200}>
        <ServicesDownAlert />
      </Show>
    </ErrorBoundary>
  );
}

function ServicesDownAlert() {
  return (
    <Alert variant={"destructive"} class="bg-secondary">
      <AlertTitle class="text-xl leading-10 flex items-center">
        <Icon icon={"lucide:triangle-alert"} class="text-2xl text-destructive" />
        <span class="ml-2">Heads up!</span>
      </AlertTitle>
      <AlertDescription>We apologize but our services are currently down!</AlertDescription>
    </Alert>
  );
}
