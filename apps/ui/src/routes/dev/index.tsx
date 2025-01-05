import Timer from "~/components/lobby/picking-phase/Timer";

export default function Dev() {
  return (
    <div class="container mx-auto">
      <Timer maxTime={30} currentTime={25} />
    </div>
  );
}
