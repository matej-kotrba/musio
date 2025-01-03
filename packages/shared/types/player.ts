export type Icon = {
  url: string;
  name: string;
};

export type Player = {
  name: string;
  icon: Icon;
  points: number;
  isHost: boolean;
  isMe: boolean;
};

export type PlayerFromServer = Omit<Player, "icon"> & { icon: string };
