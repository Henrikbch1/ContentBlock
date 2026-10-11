import { RichText } from "../common/RichText";
import { Section } from "../layout/Section";
import type { BlockProps, BlockText } from "../../lib/types";

export const TextBlock = ({
  item,
  background,
}: BlockProps<BlockText>): React.JSX.Element => (
  <Section background={background} containerClassName="max-w-3xl">
    {item.headline && (
      <h2 className="mb-6 text-3xl font-semibold tracking-tight">
        {item.headline}
      </h2>
    )}
    <RichText content={item.content} />
  </Section>
);
