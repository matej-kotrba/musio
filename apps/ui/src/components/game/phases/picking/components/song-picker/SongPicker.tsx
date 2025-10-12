import styles from "./SongPicker.module.css";
import { clientOnly } from "@solidjs/start";
import { ItunesSearchResponse, ItunesSong } from "shared";
import { createEffect, createSignal, Index, Show, useContext } from "solid-js";
import { TextField, TextFieldLabel, TextFieldRoot } from "~/components/ui/textfield";
import { GlobalsContext } from "~/contexts/globals";
import { useDebounce } from "~/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Motion } from "solid-motionone";

const ClientOnlyAudioController = clientOnly(
  () => import("~/components/common/audio-controller/AudioControl")
);

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
      collectionCensoredName: "Monody (feat. Laura Brehm) [Radio Edit] - Single",
      trackCensoredName: "Monody (feat. Laura Brehm) [Radio Edit]",
      artistViewUrl: "https://music.apple.com/us/artist/thefatrat/395664545?uo=4",
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
      artistViewUrl: "https://music.apple.com/us/artist/thefatrat/395664545?uo=4",
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
      artistViewUrl: "https://music.apple.com/us/artist/thefatrat/395664545?uo=4",
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
      collectionViewUrl: "https://music.apple.com/us/album/absent/431879091?i=431879390&uo=4",
      trackViewUrl: "https://music.apple.com/us/album/absent/431879091?i=431879390&uo=4",
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

async function sendItunesRequest(query: string) {
  const data = await fetch(
    `https://itunes.apple.com/search?term=${query.replaceAll(" ", "+")}&limit=5&media=music`
  );

  if (!data.ok) return;

  const parsed = await data.json();
  return parsed as ItunesSearchResponse;
}

type Props = {
  onSongSelect: (selectedSong: ItunesSong) => void;
};

export default function SongPicker(props: Props) {
  const globals = useContext(GlobalsContext);

  const [songName, setSongName] = useDebounce<string>("", 800);
  // const [searchedSongs, setSearchedSongs] = createSignal<ItunesSong[]>(dummy_data.results);
  const [searchedSongs, setSearchedSongs] = createSignal<ItunesSong[]>([]);
  const [editedSongName, setEditedSongName] = createSignal<string>();
  // const [selectedSong, setSelectedSong] = createSignal<ItunesSong | null>(dummy_data.results[0]);
  const [selectedSong, setSelectedSong] = createSignal<ItunesSong | null>(null);

  const [isConfirmDialogOpened, setIsConfirmDialogOpened] = createSignal<boolean>(false);
  let audioElementRef: HTMLAudioElement;

  createEffect(() => {
    if (songName() !== "") setQuerriedSongs();
  });

  createEffect(() => {
    setEditedSongName(selectedSong()?.trackName);
  });

  createEffect(() => {
    selectedSong();

    if (globals && audioElementRef! && selectedSong()) {
      audioElementRef.volume = globals.volumeInPercantage() / 100;
      audioElementRef!.play();
    }
  });

  async function setQuerriedSongs() {
    const data = await sendItunesRequest(songName());
    if (data) {
      setSearchedSongs(data.results);
    }
  }

  function handleInputChange(
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ) {
    setSongName(e.target.value);
  }

  function handlePickSong(song: ItunesSong) {
    setSelectedSong(song);
  }

  function handleSongConfirmDialogOpen() {
    if (selectedSong()) {
      setIsConfirmDialogOpened(true);
    }
  }

  function handleSongConfirm() {
    if (!selectedSong()) return;

    props.onSongSelect({
      ...selectedSong()!,
      ...(editedSongName() && { trackName: editedSongName() }),
    });

    setIsConfirmDialogOpened(false);
  }

  // function onKeydown(e: KeyboardEvent) {
  //   if (e.code !== "ArrowUp" && e.code !== "ArrowDown") return;
  //   e.preventDefault();

  // }

  return (
    <div>
      <Dialog open={isConfirmDialogOpened()} onOpenChange={setIsConfirmDialogOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure sure you want to pick this song?</DialogTitle>
            <DialogDescription>
              <TextFieldRoot class="my-4">
                <TextFieldLabel for="edited-name">
                  You can change the original song name:
                </TextFieldLabel>
                <TextField
                  type="text"
                  name="edited-name"
                  placeholder="Name"
                  min={1}
                  autocomplete="off"
                  value={editedSongName()}
                  on:input={(e) => setEditedSongName(e.target.value)}
                />
              </TextFieldRoot>
              <div class="flex gap-2 w-fit ml-auto">
                <Button variant={"default"} on:click={handleSongConfirm}>
                  Confirm
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div class="w-80 mx-auto pt-4 p-1 relative overflow-hidden">
        <div class="h-40">
          <Show when={selectedSong()} keyed>
            <Motion.p
              title={selectedSong()!.trackName}
              class={`text-center text-ellipsis overflow-hidden font-semibold whitespace-nowrap mb-2`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {selectedSong()!.trackName}
            </Motion.p>

            <div class="flex flex-col">
              <div class={`${styles.effect} relative`}>
                <Motion.img
                  src={selectedSong()!.artworkUrl100}
                  width={100}
                  height={100}
                  alt="Picked song"
                  class={`mx-auto rounded-lg mb-1`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </Show>
          <Show when={selectedSong()}>
            <ClientOnlyAudioController
              audioUrl={selectedSong()!.previewUrl}
              fallback={<div class="w-full h-8" />}
            />
          </Show>
        </div>

        <TextFieldRoot class="mt-4">
          <TextFieldLabel for="name" class="block text-center">
            Pick song for others to guess:
          </TextFieldLabel>
          <div class="focus-within:ring-2 ring-primary-accent rounded-md duration-150">
            <TextField
              type="text"
              name="name"
              placeholder="Search for a song name..."
              on:input={handleInputChange}
              min={1}
              autocomplete="off"
              class="text-lg py-6 focus-visible:ring-0"
            />
          </div>
        </TextFieldRoot>
        <Show when={searchedSongs().length > 0}>
          <div class="w-full overflow-hidden border border-foreground rounded-md mt-2">
            <div
              class="flex flex-col divide-y-[1px] divide-white/40 overflow-y-auto max-h-[calc(var(--item-overflow-count)*var(--item-height))]"
              style={"--item-height: 4rem; --item-overflow-count: 3;"}
            >
              <Index each={searchedSongs()}>
                {(song, index) => {
                  return (
                    <button
                      type="button"
                      class={`${styles.song} h-[var(--item-height)] isolate relative flex items-center gap-2 p-2 hover:bg-background-DEAFULT duration-150 outline-none focus-within:outline-none focus-within:bg-background-DEAFULT`}
                      data-selected={song().trackId === selectedSong()?.trackId}
                      aria-selected={song().trackId === selectedSong()?.trackId}
                      on:click={() => handlePickSong(song())}
                      title={song().trackName}
                      role="option"
                      id={`opt-${index}`}
                    >
                      <img
                        src={song().artworkUrl60}
                        width={56}
                        height={56}
                        alt=""
                        class="size-14 left-0 rounded-lg shadow-md shadow-black/30"
                        // style={{ mask: "linear-gradient(to right, black, transparent 100%)" }}
                      />
                      <div class="flex flex-col items-start overflow-hidden">
                        <div class="w-full text-base font-semibold overflow-hidden whitespace-nowrap text-ellipsis">
                          {song().trackName}
                        </div>
                        <span class="text-foreground/80">{song().artistName}</span>
                      </div>
                    </button>
                  );
                }}
              </Index>
            </div>
          </div>
        </Show>
        <button
          type="button"
          class="w-full bg-primary text-background-highlight rounded-md px-4 py-2 mt-2 font-bold duration-200 disabled:bg-background-accent
            disabled:text-background-highlight hover:bg-primary-darker hover:text-foreground"
          disabled={!selectedSong()}
          on:click={handleSongConfirmDialogOpen}
        >
          Select song
        </button>
      </div>
    </div>
  );
}
