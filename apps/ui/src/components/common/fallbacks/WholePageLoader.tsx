import { Motion } from "solid-motionone";
import Loader from "../loader/Loader";

export default function WholePageLoaderFallback() {
  return (
    <Motion.div
      class="fixed inset-0 grid place-content-center bg-black/40 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Loader />
    </Motion.div>
  );
}
