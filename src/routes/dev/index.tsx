import { getAllIcons } from "~/components/lobby/Player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import styles from "./index.module.css";
import { Icon } from "@iconify-icon/solid";
import {
  TextField,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";

export default function Dev() {
  const icons = getAllIcons();

  return (
    <div class="container mx-auto">
      <Dialog open>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set your game profile</DialogTitle>
            <DialogDescription>
              <div>
                <div
                  class={`${styles.profile} relative overflow-hidden rounded-lg p-2`}
                >
                  <button
                    type="button"
                    class="group relative rounded-full overflow-hidden block mx-auto w-40 aspect-square"
                  >
                    <Icon
                      icon="fluent:edit-12-filled"
                      class="absolute grid text-4xl px-1 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-transparent group-hover:text-white duration-200"
                    />
                    <img
                      src={icons[Math.round(Math.random() * icons.length)].url}
                      alt="Player icon"
                      class="group-hover:brightness-50 duration-200"
                    />
                  </button>
                </div>
                <TextFieldRoot>
                  <TextFieldLabel>Name</TextFieldLabel>
                  <TextField type="text" placeholder="Name" />
                </TextFieldRoot>
              </div>
              {/* This action cannot be undone. This will permanently delete your
              account and remove your data from our servers. */}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
