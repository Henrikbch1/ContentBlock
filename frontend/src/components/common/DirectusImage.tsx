import { getAssetUrl } from "../../lib/directus";
import type { DirectusAsset } from "../../lib/types";

type DirectusImageProps = {
  asset?: DirectusAsset;
  alt: string;
  className?: string;
};

export const DirectusImage = ({
  asset,
  alt,
  className = "",
}: DirectusImageProps): React.JSX.Element | null => {
  const src = getAssetUrl(asset);

  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      decoding="async"
      loading="lazy"
    />
  );
};
