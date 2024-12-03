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
import { createSignal, onCleanup, onMount } from "solid-js";
import { useLocalStorage } from "~/hooks";

export default function Dev() {
  const sideIconsCount = 1;
  const icons = getAllIcons();

  const [localStorageName, setLocalStorageName] = useLocalStorage("last_name");
  const [localStorageIcon, setLocalStorageIcon] = useLocalStorage("last_icon");

  const [selectedIconIndex, setSelectedIconIndex] = createSignal(0);
  const [name, setName] = createSignal(localStorageName() ?? "");

  const getIconByIndex = (index: number) =>
    icons.find((_, idx) => idx === index);

  function moveCarousel(ratio: -1 | 1) {
    const newValue = selectedIconIndex() + 1 * ratio;
    if (newValue < 0 || newValue > icons.length - 1) return;
    setSelectedIconIndex((old) => old + 1 * ratio);
  }

  function onSubmit() {
    const currentIcon = getIconByIndex(selectedIconIndex())?.name;

    setLocalStorageName(name());
    setLocalStorageIcon(currentIcon ?? null);
  }

  const moveCarouselLeft = () => moveCarousel(-1);
  const moveCarouselRight = () => moveCarousel(1);
  const onKeyDownMoveCarousel = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      moveCarouselLeft();
    } else if (e.key === "ArrowRight") {
      moveCarouselRight();
    }
  };

  // TODO: Possible race condition due to onMount in useLocalStorage
  onMount(() => {
    const savedName = localStorageName();
    if (savedName) {
      setName(savedName);
    }

    const lsIconIndex = icons.findIndex((icon) => {
      return icon.name === localStorageIcon();
    });

    if (lsIconIndex !== -1) {
      setSelectedIconIndex(lsIconIndex);
    }

    window.addEventListener("keydown", onKeyDownMoveCarousel);

    onCleanup(() => {
      window.removeEventListener("keydown", onKeyDownMoveCarousel);
    });
  });

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
                      icons.length
                    }; --selected-icon: ${selectedIconIndex()}; --side-icons-count: ${sideIconsCount}`}
                  >
                    {/* Blank div for grid repeat */}
                    {Array(sideIconsCount + 1)
                      .fill(0)
                      .map((_) => (
                        <div></div>
                      ))}
                    {icons.map((icon) => {
                      return <CarouselIcon url={icon.url} />;
                    })}
                  </div>
                  <button
                    type="button"
                    on:click={moveCarouselLeft}
                    class="hover:text-foreground duration-150 absolute left-1 top-1/2 -translate-y-1/2"
                  >
                    <Icon icon="raphael:arrowleft" class="text-4xl px-1" />
                  </button>
                  <button
                    type="button"
                    on:click={moveCarouselRight}
                    class="hover:text-foreground duration-150 absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    <Icon icon="raphael:arrowright" class="text-4xl px-1" />
                  </button>
                </div>
                <TextFieldRoot>
                  <TextFieldLabel>Name</TextFieldLabel>
                  <TextField
                    type="text"
                    placeholder="Name"
                    value={name()}
                    on:change={(e) => setName(e.target.value)}
                  />
                </TextFieldRoot>
                <button
                  type="button"
                  on:click={onSubmit}
                  class="bg-primary block ml-auto mt-2 text-[1rem] font-semibold px-6 py-2 rounded-md text-background-DEAFULT hover:bg-primary-darker hover:text-foreground duration-150"
                >
                  Save
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CarouselIcon(props: { url: string }) {
  return (
    <div class="relative overflow-hidden w-full aspect-square">
      <img src={props.url} alt="" class="p-1 rounded-full" />
    </div>
  );
}
