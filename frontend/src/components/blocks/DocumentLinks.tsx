const linkClassName =
  "inline-flex min-h-11 items-center text-base font-bold text-link underline decoration-2 underline-offset-4 hover:decoration-4";

interface DocumentLinkProps {
  href: string;
  label: string;
  title: string;
}

const DocumentLink = ({
  href,
  label,
  title,
}: DocumentLinkProps): React.JSX.Element => (
  <a className={linkClassName} href={href} target="_blank" rel="noreferrer">
    {label}
    <span className="sr-only">: {title} (öffnet in neuem Tab)</span>
  </a>
);

interface DocumentLinksProps {
  title: string;
  fileUrl: string;
  monochromeUrl: string | null;
}

/**
 * Opens a document; offers a color and a print-friendly variant when both exist.
 */
export const DocumentLinks = ({
  title,
  fileUrl,
  monochromeUrl,
}: DocumentLinksProps): React.JSX.Element => {
  if (!monochromeUrl) {
    return (
      <div className="mt-auto pt-5">
        <DocumentLink href={fileUrl} label="Dokument öffnen" title={title} />
      </div>
    );
  }

  return (
    <div className="mt-auto pt-5">
      <p className="text-sm font-bold text-muted-foreground">Version wählen</p>
      <ul className="mt-1 flex flex-wrap gap-x-6">
        <li>
          <DocumentLink href={fileUrl} label="Farbe öffnen" title={title} />
        </li>
        <li>
          <DocumentLink
            href={monochromeUrl}
            label="Schwarz-Weiß öffnen"
            title={`${title}, druckfreundlich`}
          />
        </li>
      </ul>
    </div>
  );
};
