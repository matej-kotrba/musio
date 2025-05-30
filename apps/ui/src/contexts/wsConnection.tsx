import { createContext, JSX, useContext } from "solid-js";

type WsConnectionContext = {
  send?: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
};

const WsConnection = createContext<WsConnectionContext>({});

type WsConnectionProviderProps = {
  wsConnection: WsConnectionContext;
  children: JSX.Element;
};

export function WsConnectionProvider(props: WsConnectionProviderProps) {
  return <WsConnection.Provider value={props.wsConnection}>{props.children}</WsConnection.Provider>;
}

export const useWsConnection = () => useContext(WsConnection);

// export type WsContext = {
//   ws: WebSocket | undefined;
//   href: string;
//   lobbyId: string;
//   playerId: string;
//   onMessage: (event: MessageEvent<string>) => void;
//   log: (user: string, ...args: Array<string>) => void;
//   clear: () => void;
//   send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
// };

// export type WsConnectionStore = { [key: string]: never } | WsContext;

// export const WsConnectionContext = createContext<{
//   connection: WsConnectionStore;
//   setConnection: SetStoreFunction<WsConnectionStore>;
// }>();

// export const isWsConnectionContext = (
//   context: WsConnectionStore
// ): context is WsContext => {
//   return Object.keys(context).length > 0;
// };

// export function WsConnectionContextProvider(props: { children: JSXElement }) {
//   const [connection, setConnection] = createStore<WsConnectionStore>({});

//   return (
//     <WsConnectionContext.Provider value={{ connection, setConnection }}>
//       {props.children}
//     </WsConnectionContext.Provider>
//   );
// }
