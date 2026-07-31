import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Image03Icon } from "@hugeicons/core-free-icons";
import { useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ImageFilePreviewProps {
  url: File | string | null;
  className?: string;
}

export default function ImageFilePreview({ url, className }: ImageFilePreviewProps) {
  const previewUrl = useMemo(() => {
    if (typeof url === "string") return url;

    if (url instanceof File) return URL.createObjectURL(url);

    return null;
  }, [url]);

  useEffect(() => {
    return () => {
      if (url instanceof File && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [url, previewUrl]);

  return (
    <div className={`relative overflow-hidden shrink-0 size-[90px] rounded-lg border border-input ${className}`}>
      {previewUrl ? (
        <Dialog>
          <DialogTrigger className="group">
            <HugeiconsIcon
              icon={Image03Icon}
              size={32}
              strokeWidth={1.5}
              className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden duration-150 text-white group-hover:block"
            />
            <Image src={previewUrl} alt="Image Preview" fill className="object-cover duration-150 group-hover:brightness-60" />
          </DialogTrigger>
          <DialogContent className="aspect-square rounded-2xl overflow-hidden">
            <Image src={previewUrl} alt="Image Preview" fill className="object-cover" />
          </DialogContent>
        </Dialog>
      ) : (
        <div className="size-full bg-input/30 grid place-content-center">
          <HugeiconsIcon icon={Image03Icon} size={32} strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}
