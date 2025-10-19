export type Icon = {
  url: string;
  name: string;
};

export type PlayerStatus = "connected" | "disconnected";

export type Player = {
  publicId: string;
  name: string;
  points: number;
  connectionStatus: PlayerStatus;
};

export type ClientPlayer = Player & {
  icon: Icon;
  isHost: boolean;
  isChecked?: boolean;
};

export type ClientPlayerFromServer = Omit<ClientPlayer, "icon"> & { icon: string };
