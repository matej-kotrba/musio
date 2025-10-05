import { createSignal } from "solid-js";
import { isServer } from "solid-js/web";

export default function useCookie() {
  const [cookies, setCookies] = createSignal<string[]>(
    isServer ? [] : document.cookie.split(";").map((c) => c.trim())
  );

  const convertCookieToObject = (cookie: string[], key: string) => {
    let final: {
      key: string;
      value: string | null;
    } = {
      key: key,
      value: null,
    };

    cookie.forEach((c) => {
      if (c.includes(`${key}=`)) {
        final.value = c.split(`${key}=`)[1];
      }
    });

    return final;
  };

  const get = (key: string) => {
    return convertCookieToObject(cookies(), key);
  };

  const set = (
    key: string,
    { value, expires, path }: { value: string; expires?: string; path?: string }
  ) => {
    const cookies = document.cookie.split(";");
    const startIndex = cookies.findIndex((c) => c.includes(`${key}=`));
    if (startIndex !== -1) {
      deleteCookie(key);
    }

    document.cookie = [
      `${key}=${value}`,
      expires ? `expires=${expires}` : "",
      path ? `path=${path}` : "",
      `samesite=none`,
      `secure=true`,
    ].join(";");

    setCookies((old) => [...old, `${key}=${value}`]);
  };

  const deleteCookie = (...keys: string[]) => {
    const cookies = document.cookie.split(";");
    cookies.forEach((c, index) => {
      let cookieName = c.split("=")[0];
      if (keys.includes(cookieName)) {
        // Sets expiration to the past so browser clears the cookie
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

        setCookies((old) => {
          return old.splice(index, 1);
        });
      }
    });
  };

  return {
    get,
    set,
    deleteCookie,
  };
}
