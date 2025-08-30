import type {
  FromMessageOnServer,
  FromMessageOnServerByStateType,
  WS_MessageMapClient,
} from "shared";
import type { Lobby } from "../../game/lobby";

interface Mapping {
  A: "a";
  B: "b";
  C: "c";
  D: "d";
  E: "e";
  F: "f";
  G: "g";
  H: "h";
  I: "i";
  J: "j";
  K: "k";
  L: "l";
  M: "m";
  N: "n";
  O: "o";
  P: "p";
  Q: "q";
  R: "r";
  S: "s";
  T: "t";
  U: "u";
  V: "v";
  W: "w";
  X: "x";
  Y: "y";
  Z: "z";
}

type MappingKeys = keyof Mapping;

type Convert<
  T extends string,
  Base extends string = "",
  IsFirst extends boolean = true
> = T extends `${infer Char}${infer Rest}`
  ? Char extends "_"
    ? Convert<Rest, Base, true>
    : Char extends MappingKeys
    ? IsFirst extends true
      ? Convert<Rest, `${Base}${Char}`, false>
      : Convert<Rest, `${Base}${Mapping[Char]}`, false>
    : Convert<Rest, `${Base}${Char}`, false>
  : Base;

type PhasesHandlerMethodsOriginal = {
  [Key in keyof WS_MessageMapClient as `handle${Convert<Key>}`]?: (
    publisherPrivateId: string,
    eventData: Extract<FromMessageOnServer["message"], { type: Key }>
  ) => void;
};
