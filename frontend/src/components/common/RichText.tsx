type RichTextProps = {
  content?: string | null;
  className?: string;
};

const ALLOWED_TAGS = new Set([
  "P",
  "BR",
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "UL",
  "OL",
  "LI",
  "A",
  "H2",
  "H3",
  "H4",
]);

const escapeHtml = (content: string): string =>
  content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sanitizeHtml = (content: string): string => {
  if (typeof DOMParser === "undefined") {
    return escapeHtml(content.replace(/<[^>]*>/g, " "));
  }

  const document = new DOMParser().parseFromString(content, "text/html");
  const elements = document.body.querySelectorAll("*");

  elements.forEach((element) => {
    if (!ALLOWED_TAGS.has(element.tagName)) {
      element.replaceWith(document.createTextNode(element.textContent ?? ""));
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      const isSafeLink =
        element.tagName === "A" &&
        attribute.name === "href" &&
        /^(https?:|mailto:|tel:|#|\/)/i.test(attribute.value);

      if (!isSafeLink) {
        element.removeAttribute(attribute.name);
      }
    });

    if (element.tagName === "A") {
      element.setAttribute("rel", "noreferrer");
    }
  });

  return document.body.innerHTML;
};

export const RichText = ({
  content,
  className = "",
}: RichTextProps): React.JSX.Element => {
  if (!content) {
    return <p className={className}>Noch kein Text vorhanden.</p>;
  }

  return (
    <div
      className={`prose prose-zinc max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
    />
  );
};
