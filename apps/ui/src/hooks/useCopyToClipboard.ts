import toast from "solid-toast";

type Props = {
  onSuccessMessage?: string;
  onErrorMessage?: string;
};

export default function useCopyToClipboard(props?: Props) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  };

  const onCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(props?.onSuccessMessage ?? "Copied to clipboard");
    } else {
      toast.error(props?.onErrorMessage ?? "Failed to copy to clipboard");
    }
  };

  return (text: string) => onCopy(text);
}
