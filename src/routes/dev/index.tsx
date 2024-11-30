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
              <div class={`${styles.profile}`}>
                <img
                  src={icons[Math.round(Math.random() * icons.length)].url}
                  alt="Player icon"
                  class="w-40 aspect-square rounded-full mx-auto"
                />
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
