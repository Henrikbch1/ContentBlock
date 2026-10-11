import { DirectusImage } from "../common/DirectusImage";
import { Section } from "../layout/Section";
import type { BlockImage, BlockProps } from "../../lib/types";

export const ImageBlock = ({
  item,
  background,
}: BlockProps<BlockImage>): React.JSX.Element => (
  <Section background={background}>
    <div className="aspect-video overflow-hidden rounded-card bg-muted">
      <DirectusImage
        asset={item.image}
        alt={item.alt || ""}
        className="h-full w-full object-cover"
      />
    </div>
  </Section>
);
