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
import { createSignal } from "solid-js";

export default function Dev() {
  const [selectedIcon, setSelectedIcon] = createSignal(2);
  const iconUrls = getAllIcons().map((icon) => icon.url);

  const getIcon = () => iconUrls[selectedIcon()];

  function getIndexOfIcon(url: string) {
    return iconUrls.indexOf(url);
  }

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
                  class={`${styles.profile} relative overflow-hidden rounded-lg p-2 mb-4`}
                >
                  <div
                    class={`${styles.icons}`}
                    style={`--icons-count: ${
                      iconUrls.length
                    }; --selected-icon: ${selectedIcon()}`}
                  >
                    {iconUrls.map((url) => {
                      return <CarouselIcon url={url} />;
                    })}
                  </div>
                </div>
                <TextFieldRoot>
                  <TextFieldLabel>Name</TextFieldLabel>
                  <TextField type="text" placeholder="Name" />
                </TextFieldRoot>
                <button
                  type="submit"
                  class="bg-primary block ml-auto mt-2 text-[1rem] font-semibold px-6 py-2 rounded-md text-background-DEAFULT hover:bg-primary-darker hover:text-foreground duration-150"
                >
                  Save
                </button>
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

function CarouselIcon(props: { url: string }) {
  return (
    <div class="relative overflow-hidden rounded-full w-full aspect-square p-1">
      <img src={props.url} alt="" class="" />
    </div>
  );
}
