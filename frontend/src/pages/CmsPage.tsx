import { BlockRenderer } from "../components/blocks/BlockRenderer";
import { EmptyState } from "../components/common/EmptyState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { Section } from "../components/layout/Section";
import { useAsyncResource } from "../lib/hooks/useAsyncResource";
import { usePageTitle } from "../lib/hooks/usePageTitle";
import { ERROR_MESSAGES, LOADING_MESSAGES } from "../lib/uiMessages";
import { getPageBySlug } from "../lib/queries";
import type { Page, PageBlock } from "../lib/types";
import { NotFoundPage } from "./NotFoundPage";

type CmsPageProps = {
  slug: string;
};

const sortBlocks = (page: Page): PageBlock[] =>
  [...(page.blocks ?? [])].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

const normalize = (text: string): string =>
  text.trim().toLocaleLowerCase("de-DE");

/** Drops a leading text headline that only repeats the page title shown above it. */
const withoutRepeatedTitle = (
  blocks: PageBlock[],
  title: string,
): PageBlock[] => {
  const [first, ...rest] = blocks;
  const item = first?.item;
  if (
    first?.collection !== "block_text" ||
    !item ||
    typeof item !== "object" ||
    !("headline" in item) ||
    normalize(item.headline ?? "") !== normalize(title)
  ) {
    return blocks;
  }
  return [{ ...first, item: { ...item, headline: null } }, ...rest];
};

export const CmsPage = ({ slug }: CmsPageProps): React.JSX.Element => {
  const {
    data: page,
    isLoading,
    hasError,
  } = useAsyncResource(() => getPageBySlug(slug), [slug]);

  usePageTitle(page?.title);

  if (isLoading) {
    return <LoadingState centered message={LOADING_MESSAGES.page} />;
  }
  if (hasError) {
    return <EmptyState message={ERROR_MESSAGES.page} />;
  }
  if (!page) {
    return <NotFoundPage />;
  }

  const title = page.title?.trim();
  const blocks = sortBlocks(page);
  const showsTitle = Boolean(title) && blocks[0]?.collection !== "block_hero";
  return (
    <>
      {showsTitle && title && (
        <Section className="pb-0">
          <PageHeader title={title} />
        </Section>
      )}
      <BlockRenderer
        blocks={
          showsTitle && title ? withoutRepeatedTitle(blocks, title) : blocks
        }
      />
    </>
  );
};
