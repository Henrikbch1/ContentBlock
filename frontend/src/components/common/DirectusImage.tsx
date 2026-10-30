import { getAssetUrl } from "../../lib/directus";
import type { DirectusAsset } from "../../lib/types";

type DirectusImageProps = Readonly<{
  asset?: DirectusAsset;
  alt: string;
  className?: string;
  priority?: boolean;
}>;

export const DirectusImage = ({
  asset,
  alt,
  className = "",
  priority = false,
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
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : "lazy"}
    />
  );
};
