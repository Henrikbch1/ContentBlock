import { DirectusImage } from "../common/DirectusImage";
import { Section } from "../layout/Section";
import type { BlockImage } from "../../lib/types";

export const ImageBlock = ({
  item,
}: {
  item: BlockImage;
}): React.JSX.Element => (
  <Section>
    <div className="aspect-video overflow-hidden bg-muted">
      <DirectusImage
        asset={item.image}
        alt={item.alt || ""}
        className="h-full w-full object-cover"
      />
    </div>
  </Section>
);
