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
