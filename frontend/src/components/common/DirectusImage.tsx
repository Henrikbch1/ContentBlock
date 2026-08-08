import type { DirectusAsset } from "../../lib/types";

type DirectusImageProps = {
  asset: DirectusAsset;
  alt: string;
  className?: string;
};

const getAssetId = (asset: DirectusAsset): string | number | null => {
  if (typeof asset === "string" || typeof asset === "number") {
    return asset;
  }

  if (asset && typeof asset === "object") {
    return asset.id;
  }

  return null;
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
