import { RichText } from "../common/RichText";
import { Section } from "../layout/Section";
import type { BlockText } from "../../lib/types";

export const TextBlock = ({ item }: { item: BlockText }): React.JSX.Element => (
  <Section containerClassName="max-w-3xl">
    {item.headline && (
      <h2 className="mb-6 text-3xl font-semibold tracking-tight">
        {item.headline}
      </h2>
    )}
    <RichText content={item.content} className="text-base leading-7" />
  </Section>
);
