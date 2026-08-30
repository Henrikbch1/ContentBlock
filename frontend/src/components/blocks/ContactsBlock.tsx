import { BriefcaseBusiness, Mail, Phone } from "lucide-react";

import { getContactsForBlock } from "../../lib/queries";
import { useAsyncResource } from "../../lib/hooks/useAsyncResource";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
} from "../../lib/uiMessages";
import type { BlockContacts, Person } from "../../lib/types";
import { EmptyState } from "../common/EmptyState";
import { DirectusImage } from "../common/DirectusImage";
import { LoadingState } from "../common/LoadingState";
import { Section } from "../layout/Section";
import { ContactForm } from "./ContactForm";

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
  const {
    data: contacts,
    isLoading,
    hasError,
  } = useAsyncResource(() => getContactsForBlock(item), [item]);
  const contactList = contacts ?? [];

  return (
    <Section>
      {item.title && (
        <h2 className="mb-6 text-3xl font-semibold tracking-tight">
          {item.title}
        </h2>
      )}
      {isLoading && <LoadingState message={LOADING_MESSAGES.contacts} />}
      {!isLoading && hasError && (
        <EmptyState message={ERROR_MESSAGES.contacts} />
      )}
      {!isLoading && !hasError && contactList.length === 0 && (
        <EmptyState
          message={
            item.mode === "by_role" && item.roles?.length
              ? EMPTY_MESSAGES.contactsByRole
              : EMPTY_MESSAGES.contacts
          }
        />
      )}
      {!isLoading &&
        !hasError &&
        item.layout === "form" &&
        contactList.length > 0 && (
          <ContactForm
            recipientEmail={
              contactList.find((contact) => contact.email)?.email ?? ""
            }
            recipientName={getContactName(contactList[0])}
          />
        )}
      {!isLoading &&
        !hasError &&
        item.layout !== "form" &&
        contactList.length > 0 && (
          <div
            className={
              item.layout === "list"
                ? "flex flex-col gap-3"
                : "grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            }
          >
            {contactList.map((contact) => {
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
    </Section>
  );
};
