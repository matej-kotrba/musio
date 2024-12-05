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
  TextFieldErrorMessage,
  TextFieldLabel,
  TextFieldRoot,
} from "~/components/ui/textfield";
import { createSignal, onCleanup, onMount } from "solid-js";
import { useLocalStorage } from "~/hooks";
import { playerProfileSchema } from "~/utils/validation/player";
import toast, { Toaster } from "solid-toast";

type CarouselIconType = "selected" | "neighbour" | "none";

const carouselIconTypes: Record<
  CarouselIconType,
  { styles: string; cssSize: string }
> = {
  selected: {
    styles: "",
    cssSize: "8rem",
  },
  neighbour: {
    styles: "brightness-50",
    cssSize: "4rem",
  },
  none: {
    styles: "",
    cssSize: "0",
  },
};

export default function Dev() {
  const icons = getAllIcons();

  const [localStorageName, setLocalStorageName] = useLocalStorage("last_name");
  const [localStorageIcon, setLocalStorageIcon] = useLocalStorage("last_icon");

  const [selectedIconIndex, setSelectedIconIndex] = createSignal(0);

  const [nameError, setNameError] = createSignal<string | null>(null);

  const getIconByIndex = (index: number) =>
    icons.find((_, idx) => idx === index);

  function moveCarousel(ratio: -1 | 1) {
    const newValue = selectedIconIndex() + 1 * ratio;
    if (newValue < 0 || newValue > icons.length - 1) return;
    setSelectedIconIndex((old) => old + 1 * ratio);
  }

  function getCarouselIconType(idx: number): CarouselIconType {
    const currentIdx = selectedIconIndex();
    if (currentIdx === idx) return "selected";
    if (Math.abs(idx - selectedIconIndex()) === 1) return "neighbour";
    else return "none";
  }

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name");
    const icon = formData.get("icon");

    const result = playerProfileSchema.safeParse({ name, icon });

    if (result.success === false) {
      const nameErrors = result.error.flatten().fieldErrors.name;
      const iconErrors = result.error.flatten().fieldErrors.icon;

      if (nameErrors?.length) {
        setNameError(nameErrors[0]);
      } else {
        setNameError(null);
      }

      if (iconErrors?.length) {
        toast.error(iconErrors[0]);
      }

      return;
    }

    setNameError(null);
    toast.success("Set your profile successfully!");

    setLocalStorageName(name!.toString());
    setLocalStorageIcon(icon!.toString());
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
                    class={`${styles.icons} min-h-[8rem]`}
                    style={{
                      "grid-template-columns": icons
                        .map((_, idx) => {
                          return carouselIconTypes[getCarouselIconType(idx)]
                            .cssSize;
                        })
                        .join(" "),
                    }}
                  >
                    {icons.map((icon, idx) => {
                      return (
                        <CarouselIcon
                          url={icon.url}
                          type={getCarouselIconType(idx)}
                        />
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    on:click={moveCarouselLeft}
                    class="hover:text-foreground duration-150 absolute left-1 top-1/2 -translate-y-1/2 focus-within:outline-none focus-within:text-foreground"
                  >
                    <Icon icon="raphael:arrowleft" class="text-4xl px-1" />
                  </button>
                  <button
                    type="button"
                    on:click={moveCarouselRight}
                    class="hover:text-foreground duration-150 absolute right-1 top-1/2 -translate-y-1/2 focus-within:outline-none focus-within:text-foreground"
                  >
                    <Icon icon="raphael:arrowright" class="text-4xl px-1" />
                  </button>
                </div>
                <form on:submit={onSubmit}>
                  <input
                    type="hidden"
                    name="icon"
                    value={getIconByIndex(selectedIconIndex())?.name}
                  ></input>
                  <TextFieldRoot
                    validationState={nameError() ? "invalid" : "valid"}
                  >
                    <TextFieldLabel for="name">Name</TextFieldLabel>
                    <TextField
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={localStorageName() ?? ""}
                      min={1}
                    />
                    <TextFieldErrorMessage>{nameError()}</TextFieldErrorMessage>
                  </TextFieldRoot>
                  <button
                    type="submit"
                    class="bg-primary block ml-auto mt-2 text-[1rem] font-semibold px-6 py-2 rounded-md text-background-DEAFULT hover:bg-primary-darker hover:text-foreground duration-150
                  disabled:bg-gray-500!"
                  >
                    Save
                  </button>
                </form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CarouselIcon(props: { url: string; type: CarouselIconType }) {
  return (
    <div
      class={`${
        carouselIconTypes[props.type].styles
      } relative overflow-hidden w-full aspect-square duration-150`}
    >
      <img src={props.url} alt="" class="p-1 rounded-full" />
    </div>
  );
}
