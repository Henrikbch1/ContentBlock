import { RichText } from "../common/RichText";
import { SectionTitle } from "../common/SectionTitle";
import { Section } from "../layout/Section";
import type { BlockProps, BlockText } from "../../lib/types";

export const TextBlock = ({
  item,
  background,
}: BlockProps<BlockText>): React.JSX.Element => (
  <Section background={background} containerClassName="max-w-[50rem]">
    {item.headline && (
      <SectionTitle className="mb-6">{item.headline}</SectionTitle>
    )}
    <RichText className="prose-lg max-w-[68ch]" content={item.content} />
  </Section>
);
