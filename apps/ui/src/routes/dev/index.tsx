import { ItunesSearchResponse, ItunesSong } from "shared";
import { createEffect, createSignal, Index, Show, useContext } from "solid-js";
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
import styles from "./styles.module.css";
import { GlobalsContext } from "~/contexts/globals";
import { Icon } from "@iconify-icon/solid";

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
  resultCount: 6,
  results: [
    {
      wrapperType: "track",
      kind: "song",
      artistId: 395664545,
      collectionId: 1444888726,
      trackId: 1444888936,
      artistName: "TheFatRat",
      collectionName: "Monody (feat. Laura Brehm) [Radio Edit] - Single",
      trackName: "Monody (feat. Laura Brehm) [Radio Edit]",
      collectionCensoredName:
        "Monody (feat. Laura Brehm) [Radio Edit] - Single",
      trackCensoredName: "Monody (feat. Laura Brehm) [Radio Edit]",
      artistViewUrl:
        "https://music.apple.com/us/artist/thefatrat/395664545?uo=4",
      collectionViewUrl:
        "https://music.apple.com/us/album/monody-feat-laura-brehm-radio-edit/1444888726?i=1444888936&uo=4",
      trackViewUrl:
        "https://music.apple.com/us/album/monody-feat-laura-brehm-radio-edit/1444888726?i=1444888936&uo=4",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/85/b8/8f/85b88fcb-5be9-51af-e963-142aad843095/mzaf_5801279921877568855.plus.aac.p.m4a",
      artworkUrl30:
        "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/f3/69/33/f3693389-7610-f6e0-9767-4b3ba8f61acc/00602557309201.rgb.jpg/30x30bb.jpg",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/f3/69/33/f3693389-7610-f6e0-9767-4b3ba8f61acc/00602557309201.rgb.jpg/60x60bb.jpg",
      artworkUrl100:
        "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/f3/69/33/f3693389-7610-f6e0-9767-4b3ba8f61acc/00602557309201.rgb.jpg/100x100bb.jpg",
      collectionPrice: 1.29,
      trackPrice: 1.29,
      releaseDate: "2016-11-25T12:00:00Z",
      collectionExplicitness: "notExplicit",
      trackExplicitness: "notExplicit",
      discCount: 1,
      discNumber: 1,
      trackCount: 1,
      trackNumber: 1,
      trackTimeMillis: 252214,
      country: "USA",
      currency: "USD",
      primaryGenreName: "Dance",
      isStreamable: true,
    },
    {
      wrapperType: "track",
      kind: "song",
      artistId: 395664545,
      collectionId: 1515508181,
      trackId: 1515508187,
      artistName: "TheFatRat",
      collectionName: "Classics Remixed - EP",
      trackName: "Monody (feat. Laura Brehm) [Bimonte Remix]",
      collectionCensoredName: "Classics Remixed - EP",
      trackCensoredName: "Monody (feat. Laura Brehm) [Bimonte Remix]",
      artistViewUrl:
        "https://music.apple.com/us/artist/thefatrat/395664545?uo=4",
      collectionViewUrl:
        "https://music.apple.com/us/album/monody-feat-laura-brehm-bimonte-remix/1515508181?i=1515508187&uo=4",
      trackViewUrl:
        "https://music.apple.com/us/album/monody-feat-laura-brehm-bimonte-remix/1515508181?i=1515508187&uo=4",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/51/d3/df/51d3df20-32c6-8e9f-0b50-5b4aae36bd04/mzaf_13333891090426017302.plus.aac.p.m4a",
      artworkUrl30:
        "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c7/e2/29/c7e22953-d57c-add0-a07f-cd67830b7888/cover_4064832005936.jpg/30x30bb.jpg",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c7/e2/29/c7e22953-d57c-add0-a07f-cd67830b7888/cover_4064832005936.jpg/60x60bb.jpg",
      artworkUrl100:
        "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c7/e2/29/c7e22953-d57c-add0-a07f-cd67830b7888/cover_4064832005936.jpg/100x100bb.jpg",
      collectionPrice: 2.99,
      trackPrice: 0.99,
      releaseDate: "2020-06-12T12:00:00Z",
      collectionExplicitness: "notExplicit",
      trackExplicitness: "notExplicit",
      discCount: 1,
      discNumber: 1,
      trackCount: 6,
      trackNumber: 2,
      trackTimeMillis: 268437,
      country: "USA",
      currency: "USD",
      primaryGenreName: "Electronic",
      isStreamable: true,
    },
    {
      wrapperType: "track",
      kind: "song",
      artistId: 431879109,
      collectionId: 515623985,
      trackId: 515629561,
      artistName: "Monody",
      collectionName: "Electronic Saviors, Vol. 2: Recurrence",
      trackName: "In Between (Irradiated Mix)",
      collectionCensoredName: "Electronic Saviors, Vol. 2: Recurrence",
      trackCensoredName: "In Between (Irradiated Mix)",
      collectionArtistId: 4035426,
      collectionArtistName: "Various Artists",
      artistViewUrl: "https://music.apple.com/us/artist/monody/431879109?uo=4",
      collectionViewUrl:
        "https://music.apple.com/us/album/in-between-irradiated-mix/515623985?i=515629561&uo=4",
      trackViewUrl:
        "https://music.apple.com/us/album/in-between-irradiated-mix/515623985?i=515629561&uo=4",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/Music/5e/44/b3/mzm.paysubko.aac.p.m4a",
      artworkUrl30:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/18/2b/42/182b42fa-383b-a454-0651-b729452d82e3/Cover.jpg/30x30bb.jpg",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/18/2b/42/182b42fa-383b-a454-0651-b729452d82e3/Cover.jpg/60x60bb.jpg",
      artworkUrl100:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/18/2b/42/182b42fa-383b-a454-0651-b729452d82e3/Cover.jpg/100x100bb.jpg",
      collectionPrice: 29.99,
      trackPrice: 0.99,
      releaseDate: "2012-05-08T12:00:00Z",
      collectionExplicitness: "notExplicit",
      trackExplicitness: "notExplicit",
      discCount: 6,
      discNumber: 6,
      trackCount: 18,
      trackNumber: 10,
      trackTimeMillis: 196912,
      country: "USA",
      currency: "USD",
      primaryGenreName: "Electronic",
      isStreamable: true,
    },
    {
      wrapperType: "track",
      kind: "song",
      artistId: 431879109,
      collectionId: 431879091,
      trackId: 431879469,
      artistName: "Monody",
      collectionName: "Of Iron and Clay",
      trackName: "Ends and the Means (Assemblage 23 Mix)",
      collectionCensoredName: "Of Iron and Clay",
      trackCensoredName: "Ends and the Means (Assemblage 23 Mix)",
      artistViewUrl: "https://music.apple.com/us/artist/monody/431879109?uo=4",
      collectionViewUrl:
        "https://music.apple.com/us/album/ends-and-the-means-assemblage-23-mix/431879091?i=431879469&uo=4",
      trackViewUrl:
        "https://music.apple.com/us/album/ends-and-the-means-assemblage-23-mix/431879091?i=431879469&uo=4",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/75/cc/54/75cc5416-8ac0-7c22-4402-4be4337cd3f9/mzaf_11304598679457028491.plus.aac.p.m4a",
      artworkUrl30:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/5e/18/cd/mzi.joupdueh.jpg/30x30bb.jpg",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/5e/18/cd/mzi.joupdueh.jpg/60x60bb.jpg",
      artworkUrl100:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/5e/18/cd/mzi.joupdueh.jpg/100x100bb.jpg",
      collectionPrice: 10.99,
      trackPrice: 0.99,
      releaseDate: "2011-04-29T12:00:00Z",
      collectionExplicitness: "notExplicit",
      trackExplicitness: "notExplicit",
      discCount: 1,
      discNumber: 1,
      trackCount: 15,
      trackNumber: 15,
      trackTimeMillis: 281486,
      country: "USA",
      currency: "USD",
      primaryGenreName: "Alternative",
      isStreamable: true,
    },
    {
      wrapperType: "track",
      kind: "song",
      artistId: 395664545,
      collectionId: 1515508181,
      trackId: 1515508189,
      artistName: "TheFatRat",
      collectionName: "Classics Remixed - EP",
      trackName: "Monody (feat. Laura Brehm) [Ephixa Remix]",
      collectionCensoredName: "Classics Remixed - EP",
      trackCensoredName: "Monody (feat. Laura Brehm) [Ephixa Remix]",
      artistViewUrl:
        "https://music.apple.com/us/artist/thefatrat/395664545?uo=4",
      collectionViewUrl:
        "https://music.apple.com/us/album/monody-feat-laura-brehm-ephixa-remix/1515508181?i=1515508189&uo=4",
      trackViewUrl:
        "https://music.apple.com/us/album/monody-feat-laura-brehm-ephixa-remix/1515508181?i=1515508189&uo=4",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/b7/27/f2/b727f223-9846-f8c9-5d91-4da82142b8d4/mzaf_8969136293220000670.plus.aac.p.m4a",
      artworkUrl30:
        "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c7/e2/29/c7e22953-d57c-add0-a07f-cd67830b7888/cover_4064832005936.jpg/30x30bb.jpg",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c7/e2/29/c7e22953-d57c-add0-a07f-cd67830b7888/cover_4064832005936.jpg/60x60bb.jpg",
      artworkUrl100:
        "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/c7/e2/29/c7e22953-d57c-add0-a07f-cd67830b7888/cover_4064832005936.jpg/100x100bb.jpg",
      collectionPrice: 2.99,
      trackPrice: 0.99,
      releaseDate: "2020-06-12T12:00:00Z",
      collectionExplicitness: "notExplicit",
      trackExplicitness: "notExplicit",
      discCount: 1,
      discNumber: 1,
      trackCount: 6,
      trackNumber: 4,
      trackTimeMillis: 198133,
      country: "USA",
      currency: "USD",
      primaryGenreName: "Electronic",
      isStreamable: true,
    },
    {
      wrapperType: "track",
      kind: "song",
      artistId: 431879109,
      collectionId: 431879091,
      trackId: 431879390,
      artistName: "Monody",
      collectionName: "Of Iron and Clay",
      trackName: "Absent",
      collectionCensoredName: "Of Iron and Clay",
      trackCensoredName: "Absent",
      artistViewUrl: "https://music.apple.com/us/artist/monody/431879109?uo=4",
      collectionViewUrl:
        "https://music.apple.com/us/album/absent/431879091?i=431879390&uo=4",
      trackViewUrl:
        "https://music.apple.com/us/album/absent/431879091?i=431879390&uo=4",
      previewUrl:
        "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/be/52/38/be52388d-0ec9-a4e0-aadc-d6d2adda9378/mzaf_5675104315840671038.plus.aac.p.m4a",
      artworkUrl30:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/5e/18/cd/mzi.joupdueh.jpg/30x30bb.jpg",
      artworkUrl60:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/5e/18/cd/mzi.joupdueh.jpg/60x60bb.jpg",
      artworkUrl100:
        "https://is1-ssl.mzstatic.com/image/thumb/Music/5e/18/cd/mzi.joupdueh.jpg/100x100bb.jpg",
      collectionPrice: 10.99,
      trackPrice: 0.99,
      releaseDate: "2011-04-29T12:00:00Z",
      collectionExplicitness: "notExplicit",
      trackExplicitness: "notExplicit",
      discCount: 1,
      discNumber: 1,
      trackCount: 15,
      trackNumber: 12,
      trackTimeMillis: 381653,
      country: "USA",
      currency: "USD",
      primaryGenreName: "Alternative",
      isStreamable: true,
    },
  ],
} as ItunesSearchResponse;

export default function Dev() {
  const globals = useContext(GlobalsContext);

  const [songName, setSongName] = useDebounce<string>("", 600);
  const [searchedSongs, setSearchedSongs] = createSignal<ItunesSong[]>(
    dummy_data.results
  );
  const [pickedSong, setPickedSong] = createSignal<ItunesSong | null>(
    dummy_data.results[0]
  );

  let audioElementRef: HTMLAudioElement;

  createEffect(() => {
    if (songName() !== "") setQuerriedSongs();
  });

  createEffect(() => {
    if (globals && audioElementRef!) {
      audioElementRef.volume = globals.volumeInPercantage() / 100;
    }
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

  function handlePickSong(song: ItunesSong) {
    setPickedSong(song);
    console.log(globals);
    if (globals) {
      audioElementRef!.volume = globals.volumeInPercantage() / 100;
    }

    // TODO: Delete later
    audioElementRef!.volume = 0.05;
  }

  return (
    <div>
      <div class="w-80 mx-auto pt-4">
        <Show when={pickedSong()}>
          <div class="flex flex-col mb-4">
            <div class={`${styles.effect} relative overflow-hiddens`}>
              <img
                src={pickedSong()!.artworkUrl100}
                alt="Picked song"
                class={`mx-auto`}
              />
            </div>
            <audio
              ref={audioElementRef!}
              src={pickedSong()!.previewUrl}
              muted
              controls
            ></audio>
          </div>
        </Show>
        <TextFieldRoot>
          <TextFieldLabel for="name" class="block text-center">
            Pick song for others to guess:
          </TextFieldLabel>
          <div class="flex focus-within:ring-2 ring-primary-accent rounded-md duration-150">
            <TextField
              type="text"
              name="name"
              placeholder="Name"
              on:input={handleInputChange}
              min={1}
              autocomplete="off"
              class="text-lg py-6 border-r-0 rounded-r-none focus-visible:ring-0"
            />
            <button class="group border border-primary bg-primary rounded-r-md px-2 grid place-content-center hover:bg-primary-darker duration-100">
              <Icon
                icon="charm:tick"
                class="text-2xl text-background-DEAFULT group-hover:text-foreground duration-100"
              />
            </button>
          </div>
        </TextFieldRoot>
        <Popover open={!!searchedSongs().length}>
          <PopoverTrigger
            class="w-full pointer-events-none"
            tabindex={"-1"}
          ></PopoverTrigger>
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
                      class="flex items-center gap-2 p-2 hover:bg-background-DEAFULT duration-150 focus-within:outline-none focus-within:bg-background-DEAFULT"
                      on:click={() => handlePickSong(song())}
                      title={song().trackName}
                    >
                      <img src={song().artworkUrl60} alt="" class="size-14" />
                      <span class="text-base font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
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
