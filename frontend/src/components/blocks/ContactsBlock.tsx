import { useEffect, useState } from "react";
import { BriefcaseBusiness, Mail, Phone } from "lucide-react";

import { getContactsForBlock } from "../../lib/queries";
import type { BlockContacts, Person } from "../../lib/types";
import { EmptyState } from "../common/EmptyState";
import { DirectusImage } from "../common/DirectusImage";

type Contact = Person & { phone?: string | null };

const getContactName = (contact: Contact): string =>
  [contact.first_name, contact.last_name].filter(Boolean).join(" ") ||
  "Kontakt";

const getRoleName = (contact: Contact): string | null =>
  contact.role && typeof contact.role === "object"
    ? (contact.role.name ?? null)
    : null;

const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const ContactsBlock = ({
  item,
}: {
  item: BlockContacts;
}): React.JSX.Element => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadContacts = async (): Promise<void> => {
      setIsLoading(true);
      setHasError(false);
      try {
        const loadedContacts = await getContactsForBlock(item);
        if (isMounted) setContacts(loadedContacts);
      } catch {
        if (isMounted) setHasError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadContacts();
    return () => {
      isMounted = false;
    };
  }, [item]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      {item.title && (
        <h2 className="mb-6 text-3xl font-semibold tracking-tight">
          {item.title}
        </h2>
      )}
      {isLoading && (
        <p
          aria-live="polite"
          className="text-sm text-muted-foreground"
          role="status"
        >
          Kontakte werden geladen ...
        </p>
      )}
      {!isLoading && hasError && (
        <EmptyState message="Kontakte konnten nicht geladen werden." />
      )}
      {!isLoading && !hasError && contacts.length === 0 && (
        <EmptyState
          message={
            item.mode === "by_role" && item.roles?.length
              ? "Für die ausgewählten Rollen sind aktuell keine Personen hinterlegt."
              : "Keine Kontakte vorhanden."
          }
        />
      )}
      {!isLoading && !hasError && contacts.length > 0 && (
        <div
          className={
            item.layout === "list"
              ? "flex flex-col gap-3"
              : "grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          }
        >
          {contacts.map((contact) => {
            const name = getContactName(contact);
            const roleName = getRoleName(contact);
            return (
              <article
                className={
                  item.layout === "list"
                    ? "flex gap-4 border border-border bg-card p-5 sm:items-center"
                    : "border border-border bg-card p-6"
                }
                key={contact.id}
              >
                {item.show_photo &&
                  (contact.photo ? (
                    <DirectusImage
                      asset={contact.photo}
                      alt={name}
                      className="size-16 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
                    >
                      {getInitials(name)}
                    </div>
                  ))}
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold">{name}</h3>
                  {roleName && (
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <BriefcaseBusiness aria-hidden="true" size={15} />
                      {roleName}
                    </p>
                  )}
                  {item.show_email && contact.email && (
                    <a
                      className="mt-3 flex items-center gap-2 text-sm text-primary underline underline-offset-4"
                      href={`mailto:${contact.email}`}
                    >
                      <Mail aria-hidden="true" size={15} />
                      {contact.email}
                    </a>
                  )}
                  {item.show_phone && contact.phone && (
                    <a
                      className="mt-2 flex items-center gap-2 text-sm text-primary underline underline-offset-4"
                      href={`tel:${contact.phone}`}
                    >
                      <Phone aria-hidden="true" size={15} />
                      {contact.phone}
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
