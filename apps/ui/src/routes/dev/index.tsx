import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";

export default function Dev() {
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
            value={""}
            min={1}
            class="text-lg py-6"
          />
        </TextFieldRoot>
      </div>
    </div>
  );
}
