import { Icon } from "@iconify-icon/solid";
import { constructURL, getServerURL } from "shared";
import { createResource, Show } from "solid-js";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

const pingServerUrl = () => constructURL(getServerURL(import.meta.env.VITE_ENVIRONMENT), "ping");

async function pingBackend() {
  const response = await fetch(pingServerUrl());
  return response.status;
}

export default function BackendAccessibilityDisplay() {
  const [data] = createResource(pingBackend);

  return (
    <Show when={data() !== 200}>
      <Alert variant={"destructive"} class="bg-secondary">
        <AlertTitle class="text-xl leading-10 flex items-center">
          <Icon icon={"lucide:triangle-alert"} class="text-2xl text-destructive" />
          <span class="ml-2">Heads up!</span>
        </AlertTitle>
        <AlertDescription>We apologize but our services are currently down!</AlertDescription>
      </Alert>
    </Show>
  );
}
