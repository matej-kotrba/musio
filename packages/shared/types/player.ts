export type Icon = {
  url: string;
  name: string;
};

export type Player = {
  id: string;
  name: string;
  icon: Icon;
  points: number;
};

export type PlayerServerWithoutWS = Omit<Player, "icon" | "ws"> & {
  icon: string;
  ws?: never;
};
