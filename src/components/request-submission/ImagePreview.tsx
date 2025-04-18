
import { Image } from "lucide-react";

interface ImagePreviewProps {
  file: File | null;
  label: string;
}

export const ImagePreview = ({ file, label }: ImagePreviewProps) => {
  if (!file) return null;

  const imageUrl = URL.createObjectURL(file);

  return (
    <div className="mt-2">
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <div className="relative aspect-video w-full max-w-[200px] overflow-hidden rounded-lg border border-gray-200">
        {file.type.startsWith("image/") ? (
          <img
            src={imageUrl}
            alt={label}
            className="h-full w-full object-cover"
            onLoad={() => URL.revokeObjectURL(imageUrl)}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-50 p-4">
            <Image className="h-8 w-8 text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">{file.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
