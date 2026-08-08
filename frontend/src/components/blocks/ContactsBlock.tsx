import { useEffect, useState } from "react";

import { getContactsForBlock } from "../../lib/queries";
import type { BlockContacts, Person } from "../../lib/types";
import { EmptyState } from "../common/EmptyState";
import { DirectusImage } from "../common/DirectusImage";

type Contact = Person & { phone?: string | null };

export const ContactsBlock = ({ item }: { item: BlockContacts }): React.JSX.Element => {
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
      {item.title && <h2 className="mb-6 text-3xl font-semibold tracking-tight">{item.title}</h2>}
      {isLoading && <p aria-live="polite" className="text-sm text-muted-foreground" role="status">Kontakte werden geladen ...</p>}
      {!isLoading && hasError && <EmptyState message="Kontakte konnten nicht geladen werden." />}
      {!isLoading && !hasError && contacts.length === 0 && <EmptyState message="Keine Kontakte vorhanden." />}
      {!isLoading && !hasError && contacts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => {
            const name = [contact.first_name, contact.last_name].filter(Boolean).join(" ");
            return (
              <article className="border border-border bg-card p-6" key={contact.id}>
                {item.show_photo && contact.photo && <DirectusImage asset={contact.photo} alt={name} className="mb-4 aspect-square w-24 rounded-full object-cover" />}
                <h3 className="text-xl font-semibold">{name}</h3>
                {item.show_email && contact.email && <a className="mt-3 block text-sm underline underline-offset-4" href={`mailto:${contact.email}`}>{contact.email}</a>}
                {item.show_phone && contact.phone && <a className="mt-2 block text-sm underline underline-offset-4" href={`tel:${contact.phone}`}>{contact.phone}</a>}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
