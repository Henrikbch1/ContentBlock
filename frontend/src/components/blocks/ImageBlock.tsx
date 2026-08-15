import { DirectusImage } from "../common/DirectusImage";
import type { BlockImage } from "../../lib/types";

export const ImageBlock = ({
  item,
}: {
  item: BlockImage;
}): React.JSX.Element => (
  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
    <div className="aspect-video overflow-hidden bg-muted">
      <DirectusImage
        asset={item.image}
        alt={item.alt || ""}
        className="h-full w-full object-cover"
      />
    </div>
  </section>
);
