import { createEffect, createSignal } from "solid-js";

type Props = {};

export default function useCookie(props: Props) {
  const [cookie, setCookie] = createSignal(document.cookie);

  createEffect(() => {
    document.cookie = cookie();
  });

  const set = (key: string, value: string) => {
    // setCookie()
  };

  const get = (key: string) => {};
}
