import { ItunesSearchResponse, ItunesSong } from "shared";
import { createEffect, createSignal, Index } from "solid-js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { useDebounce } from "~/hooks";

type SolidEvent = Event & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};

async function sendItunesRequest(query: string) {
  const data = await fetch(
    `https://itunes.apple.com/search?term=${query.replaceAll(
      " ",
      "+"
    )}&limit=5&media=music`
  );

  if (!data.ok) return;

  const parsed = await data.json();
  return parsed as ItunesSearchResponse;
}

const dummy_data = {
  resultCount: 5,
  results: [
    {
      wrapperType: "track",
      kind: "song",
      artistId: 112115157,
      collectionId: 883909775,
      trackId: 883909818,
      artistName: "Power Music Workout",
      collectionName: "55 Smash Hits! - Running Mixes!",
      trackName: "Clarity (Workout Mix)",
      collectionCensoredName: "55 Smash Hits! - Running Mixes!",
      trackCensoredName: "Clarity (Workout Mix)",
      artistViewUrl:
        "https://music.apple.com/us/artist/power-music-workout/112115157?uo=4",
      collectionViewUrl:
        "https://music.apple.com/us/album/clarity-workout-mix/883909775?i=883909818&uo=4",
      trackViewUrl:
        "https://music.apple.com/us/album/clarity-workout-mix/883909775?i=883909818&uo=4",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/30/00/44/30004456-63c0-8a8a-3393-96bffbbaf5f0/mzaf_5324733758013341000.plus.aac.p.m4a",
      artworkUrl30:
        "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/03/17/95/031795b8-226a-7251-1275-0412f724bf62/55-Smash-Hits_2400.jpg/30x30bb.jpg",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/03/17/95/031795b8-226a-7251-1275-0412f724bf62/55-Smash-Hits_2400.jpg/60x60bb.jpg",
      artworkUrl100:
        "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/03/17/95/031795b8-226a-7251-1275-0412f724bf62/55-Smash-Hits_2400.jpg/100x100bb.jpg",
      collectionPrice: 9.99,
      trackPrice: 1.29,
      releaseDate: "2013-03-22T12:00:00Z",
      collectionExplicitness: "notExplicit",
      trackExplicitness: "notExplicit",
      discCount: 1,
      discNumber: 1,
      trackCount: 55,
      trackNumber: 34,
      trackTimeMillis: 233827,
      country: "USA",
      currency: "USD",
      primaryGenreName: "Fitness & Workout",
      isStreamable: true,
    },
    {
      wrapperType: "track",
      kind: "song",
      artistId: 472054,
      collectionId: 199049977,
      trackId: 199050021,
      artistName: "John Mayer",
      collectionName: "Heavier Things",
      trackName: "Clarity",
      collectionCensoredName: "Heavier Things",
      trackCensoredName: "Clarity",
      artistViewUrl: "https://music.apple.com/us/artist/john-mayer/472054?uo=4",
      collectionViewUrl:
        "https://music.apple.com/us/album/clarity/199049977?i=199050021&uo=4",
      trackViewUrl:
        "https://music.apple.com/us/album/clarity/199049977?i=199050021&uo=4",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/45/d8/ac/45d8acaf-d665-1727-8278-889406d5f5e4/mzaf_4223519344041582959.plus.aac.p.m4a",
      artworkUrl30:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/df/0a/be/mzi.bwiyzxrl.jpg/30x30bb.jpg",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/df/0a/be/mzi.bwiyzxrl.jpg/60x60bb.jpg",
      artworkUrl100:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/df/0a/be/mzi.bwiyzxrl.jpg/100x100bb.jpg",
      collectionPrice: 9.99,
      trackPrice: 1.29,
      releaseDate: "2003-09-09T07:00:00Z",
      collectionExplicitness: "notExplicit",
      trackExplicitness: "notExplicit",
      discCount: 1,
      discNumber: 1,
      trackCount: 10,
      trackNumber: 1,
      trackTimeMillis: 271760,
      country: "USA",
      currency: "USD",
      primaryGenreName: "Rock",
      isStreamable: true,
    },
    {
      wrapperType: "track",
      kind: "song",
      artistId: 368433979,
      collectionId: 1440861402,
      trackId: 1440861976,
      artistName: "Zedd",
      collectionName: "Clarity",
      trackName: "Clarity (feat. Foxes)",
      collectionCensoredName: "Clarity",
      trackCensoredName: "Clarity (feat. Foxes)",
      artistViewUrl: "https://music.apple.com/us/artist/zedd/368433979?uo=4",
      collectionViewUrl:
        "https://music.apple.com/us/album/clarity-feat-foxes/1440861402?i=1440861976&uo=4",
      trackViewUrl:
        "https://music.apple.com/us/album/clarity-feat-foxes/1440861402?i=1440861976&uo=4",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/dc/73/a0/dc73a02a-0d6d-8931-0eba-90845253cd8e/mzaf_13265866442777153519.plus.aac.p.m4a",
      artworkUrl30:
        "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/d9/f2/2b/d9f22b74-8ef3-73d8-5da1-e5268c42f114/12UMGIM52120.rgb.jpg/30x30bb.jpg",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/d9/f2/2b/d9f22b74-8ef3-73d8-5da1-e5268c42f114/12UMGIM52120.rgb.jpg/60x60bb.jpg",
      artworkUrl100:
        "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/d9/f2/2b/d9f22b74-8ef3-73d8-5da1-e5268c42f114/12UMGIM52120.rgb.jpg/100x100bb.jpg",
      collectionPrice: 8.99,
      trackPrice: 1.29,
      releaseDate: "2012-10-02T12:00:00Z",
      collectionExplicitness: "notExplicit",
      trackExplicitness: "notExplicit",
      discCount: 1,
      discNumber: 1,
      trackCount: 10,
      trackNumber: 5,
      trackTimeMillis: 271707,
      country: "USA",
      currency: "USD",
      primaryGenreName: "Dance",
      isStreamable: true,
    },
    {
      wrapperType: "track",
      kind: "song",
      artistId: 41830051,
      collectionId: 500693518,
      trackId: 500693684,
      artistName: "Bulb & Clarity",
      collectionName: "Blood Pressure",
      trackName: "Her Smooth Love",
      collectionCensoredName: "Blood Pressure",
      trackCensoredName: "Her Smooth Love",
      collectionArtistId: 36270,
      collectionArtistName: "Various Artists",
      artistViewUrl: "https://music.apple.com/us/artist/bulb/41830051?uo=4",
      collectionViewUrl:
        "https://music.apple.com/us/album/her-smooth-love/500693518?i=500693684&uo=4",
      trackViewUrl:
        "https://music.apple.com/us/album/her-smooth-love/500693518?i=500693684&uo=4",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/3f/8c/50/3f8c5048-d7f8-b05e-d1eb-021484dde659/mzaf_16545835205238101576.plus.aac.p.m4a",
      artworkUrl30:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/e2/c2/f3/mzi.jtyktbpi.jpg/30x30bb.jpg",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/e2/c2/f3/mzi.jtyktbpi.jpg/60x60bb.jpg",
      artworkUrl100:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/e2/c2/f3/mzi.jtyktbpi.jpg/100x100bb.jpg",
      collectionPrice: 9.99,
      trackPrice: 1.29,
      releaseDate: "2012-03-05T12:00:00Z",
      collectionExplicitness: "notExplicit",
      trackExplicitness: "notExplicit",
      discCount: 1,
      discNumber: 1,
      trackCount: 18,
      trackNumber: 10,
      trackTimeMillis: 293013,
      country: "USA",
      currency: "USD",
      primaryGenreName: "Dance",
      isStreamable: true,
    },
    {
      wrapperType: "track",
      kind: "song",
      artistId: 1480395567,
      collectionId: 419609289,
      trackId: 419609359,
      artistName: "Clarity",
      collectionName: "New Blood 011",
      trackName: "Underneath the Leaves",
      collectionCensoredName: "New Blood 011",
      trackCensoredName: "Underneath the Leaves",
      collectionArtistId: 4940310,
      collectionArtistName: "Various Artists",
      artistViewUrl:
        "https://music.apple.com/us/artist/clarity/1480395567?uo=4",
      collectionViewUrl:
        "https://music.apple.com/us/album/underneath-the-leaves/419609289?i=419609359&uo=4",
      trackViewUrl:
        "https://music.apple.com/us/album/underneath-the-leaves/419609289?i=419609359&uo=4",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/10/fb/a5/10fba51c-c45f-a3dd-3f80-0d5723fa37da/mzaf_6068847280894955151.plus.aac.p.m4a",
      artworkUrl30:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/88/b9/c3/mzi.lrwzswsd.jpg/30x30bb.jpg",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/88/b9/c3/mzi.lrwzswsd.jpg/60x60bb.jpg",
      artworkUrl100:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/88/b9/c3/mzi.lrwzswsd.jpg/100x100bb.jpg",
      collectionPrice: 9.99,
      trackPrice: 0.99,
      releaseDate: "2011-03-27T12:00:00Z",
      collectionExplicitness: "notExplicit",
      trackExplicitness: "notExplicit",
      discCount: 1,
      discNumber: 1,
      trackCount: 17,
      trackNumber: 14,
      trackTimeMillis: 294998,
      country: "USA",
      currency: "USD",
      primaryGenreName: "Dance",
      isStreamable: true,
    },
  ],
} as ItunesSearchResponse;

export default function Dev() {
  const [songName, setSongName] = useDebounce<string>("", 600);
  const [searchedSongs, setSearchedSongs] = createSignal<ItunesSong[]>(
    dummy_data.results
  );
  const [pickedSong, setPickedSong] = createSignal<ItunesSong | null>(
    dummy_data.results[2]
  );

  createEffect(() => {
    if (songName() !== "") setQuerriedSongs();
  });

  async function setQuerriedSongs() {
    const data = await sendItunesRequest(songName());
    if (data) {
      setSearchedSongs(data.results);
    }
  }

  function handleInputChange(e: SolidEvent) {
    setSongName(e.target.value);
  }

  return (
    <div>
      <div class="w-80 mx-auto">
        <audio src={pickedSong()?.previewUrl} muted controls></audio>
        <TextFieldRoot>
          <TextFieldLabel for="name" class="block text-center">
            Pick song for others to guess:
          </TextFieldLabel>
          <TextField
            type="text"
            name="name"
            placeholder="Name"
            on:input={handleInputChange}
            min={1}
            autocomplete="off"
            class="text-lg py-6"
          />
        </TextFieldRoot>
        <Popover open={!!searchedSongs().length}>
          <PopoverTrigger class="w-full"></PopoverTrigger>
          <PopoverContent
            class="w-80 -translate-y-4 p-0 overflow-hidden"
            withoutCloseButton
          >
            <div class="flex flex-col divide-y-[1px] divide-white/40">
              <Index each={searchedSongs()}>
                {(song) => {
                  return (
                    <button
                      type="button"
                      class="flex items-center gap-2 p-2 hover:bg-background-DEAFULT duration-150"
                    >
                      <img
                        src={song().artworkUrl60}
                        alt=""
                        class="rounded-md"
                      />
                      <span class="text-base font-semibold">
                        {song().trackName}
                      </span>
                    </button>
                  );
                }}
              </Index>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
