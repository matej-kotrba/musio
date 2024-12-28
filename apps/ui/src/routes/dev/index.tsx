import { ItunesSearchResponse, ItunesSong } from "shared";
import { createEffect, createSignal, Index } from "solid-js";
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

export default function Dev() {
  const [songName, setSongName] = useDebounce<string>("", 600);
  const [searchedSongs, setSearchedSongs] = createSignal<ItunesSong[]>([]);

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
      </div>
      <div>
        <Index each={searchedSongs()}>
          {(song) => {
            return (
              <div>
                <p>{song().trackName}</p>
              </div>
            );
          }}
        </Index>
      </div>
    </div>
  );
}
