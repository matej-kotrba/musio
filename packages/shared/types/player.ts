export type Icon = {
  url: string;
  name: string;
};

export type PlayerStatus = "connected" | "disconnected";

export type Player = {
  publicId: string;
  name: string;
  icon: Icon;
  points: number;
  isHost: boolean;
  status: PlayerStatus;
  isChecked?: boolean;
};

export type PlayerFromServer = Omit<Player, "icon" | "isChecked"> & { icon: string };
