import { getAssetId } from "../../lib/directusRelations";
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
  const assetId = getAssetId(asset);
  const directusUrl = import.meta.env.VITE_DIRECTUS_URL?.replace(/\/$/, "");

  if (!assetId || !directusUrl) {
    return null;
  }

  return (
    <img
      src={`${directusUrl}/assets/${assetId}`}
      alt={alt}
      className={className}
      decoding="async"
      loading="lazy"
    />
  );
};
