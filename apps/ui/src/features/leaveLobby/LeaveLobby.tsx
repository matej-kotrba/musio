import { DialogTriggerProps } from "@kobalte/core/dialog";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useNavigate } from "@solidjs/router";

export default function LeaveLobby() {
  const navigate = useNavigate();

  const handleLeaveLobby = () => navigate("/?leftLobby=true");

  return (
    <Dialog>
      <DialogTrigger
        as={(props: DialogTriggerProps) => (
          <Button variant={"ghost"} class="hover:bg-destructive" {...props}>
            Leave lobby
          </Button>
        )}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to leave this lobby?</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger
            as={(props: DialogTriggerProps) => (
              <Button type="submit" variant={"ghost"} {...props}>
                Cancel
              </Button>
            )}
          />
          <DialogTrigger
            onClick={handleLeaveLobby}
            as={(props: DialogTriggerProps) => (
              <Button
                type="submit"
                variant={"default"}
                class="bg-destructive hover:bg-destructive/80 text-destructive-foreground"
                {...props}
              >
                Leave
              </Button>
            )}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
