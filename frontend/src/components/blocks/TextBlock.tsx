import { RichText } from "../common/RichText";
import type { BlockText } from "../../lib/types";

export const TextBlock = ({ item }: { item: BlockText }): React.JSX.Element => (
  <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
    {item.headline && <h2 className="mb-6 text-3xl font-semibold tracking-tight">{item.headline}</h2>}
    <RichText content={item.content} className="text-base leading-7" />
  </section>
);
