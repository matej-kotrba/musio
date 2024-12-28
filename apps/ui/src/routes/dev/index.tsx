import { createEffect } from "solid-js";
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

export default function Dev() {
  const [songName, setSongName] = useDebounce<string>("", 400);

  function handleInputChange(e: SolidEvent) {
    setSongName(e.target.value);
  }

  // createEffect(() => {
  //   console.log(songName());
  // });

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
        <p>{songName()}</p>
      </div>
    </div>
  );
}
