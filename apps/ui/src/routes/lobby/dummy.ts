import { getAllIcons, type PlayerToDisplay } from "~/components/game/Player";

export const dummy_players: PlayerToDisplay[] = [
  {
    name: "Very Long cool name asd asd asd awsdasd",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 100,
    isHost: true,
    publicId: "1",
    playerStatus: "checked",
    connectionStatus: "connected",
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 89,
    isHost: false,
    publicId: "2",
    connectionStatus: "connected",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 76,
    isHost: false,
    publicId: "3",
    connectionStatus: "connected",
  },
  {
    name: "Very Long cool name",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 67,
    isHost: false,
    publicId: "4",
    connectionStatus: "connected",
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 56,
    isHost: false,
    publicId: "5",
    connectionStatus: "connected",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 43,
    isHost: false,
    publicId: "6",
    connectionStatus: "connected",
  },
  {
    name: "Very Long cool name",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 39,
    isHost: false,
    publicId: "7",
    connectionStatus: "connected",
  },
  {
    name: "Player 2",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 6,
    isHost: false,
    publicId: "8",
    connectionStatus: "connected",
  },
  {
    name: "Player 3",
    icon: getAllIcons()[Math.round(Math.random() * (getAllIcons().length - 1))],
    points: 0,
    isHost: false,
    publicId: "9",
    connectionStatus: "connected",
  },
];

export const dummySongName = ["R", null, null, null, " ", null, null, "t", null, null, "m"];

export const dummySongImage = "/2000x2000bb.jpg";

// {
//   state: "guessing",
//   initialTimeRemaining: 30,
//   currentInitialTimeRemaining: 30,
//   playersWhoGuessed: [],
//   initialDelay: 5,
//   isGuessingPaused: true,
//   startTime: 0,
// }

// {
//   artist: "TheFatRat",
//   name: [
//     ["N", "o", "b", null, null, null, null],
//     ["C", null, null, null, null, null, null],
//     [null, null],
//     [null, null, null],
//     [null, null, null, null, null],
//   ],
//   fromPlayerByPublicId: "asd",
//   trackUrl:
//     "https://music.apple.com/us/album/monody-feat-laura-brehm-radio-edit/1444888726?i=1444888936&uo=4",
//   imageUrl100x100:
//     "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/f3/69/33/f3693389-7610-f6e0-9767-4b3ba8f61acc/00602557309201.rgb.jpg/100x100bb.jpg",
// }
