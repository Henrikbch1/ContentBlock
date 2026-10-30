import { Mail, Phone } from "lucide-react";

import { getContactsForBlock } from "../../lib/queries";
import { useAsyncResource } from "../../lib/hooks/useAsyncResource";
import {
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  LOADING_MESSAGES,
  UI_LABELS,
} from "../../lib/uiMessages";
import type { BlockContacts, BlockProps, Person } from "../../lib/types";
import { noticeClassName } from "../common/cardClassName";
import { noticeGridClassName } from "../common/noticeGrid";
import { EmptyState } from "../common/EmptyState";
import { DirectusImage } from "../common/DirectusImage";
import { LoadingState } from "../common/LoadingState";
import { NoticeMeta } from "../common/NoticeMeta";
import { SectionTitle } from "../common/SectionTitle";
import { Section } from "../layout/Section";
import { ContactForm } from "./ContactForm";

const getContactName = (contact: Person): string =>
  [contact.first_name, contact.last_name].filter(Boolean).join(" ") ||
  "Kontakt";

const getRoleName = (contact: Person): string | null =>
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
  background,
}: BlockProps<BlockContacts>): React.JSX.Element => {
  const {
    data: contacts,
    isLoading,
    hasError,
  } = useAsyncResource(() => getContactsForBlock(item), [item]);
  const contactList = contacts ?? [];

  return (
    <Section background={background}>
      {item.title && <SectionTitle>{item.title}</SectionTitle>}
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
                ? "flex flex-col gap-6"
                : noticeGridClassName(contactList.length)
            }
          >
            {contactList.map((contact) => {
              const name = getContactName(contact);
              const roleName = getRoleName(contact);
              return (
                <article className={noticeClassName()} key={contact.id}>
                  <NoticeMeta label={roleName || UI_LABELS.footerContact} />
                  <div className="flex gap-4 sm:items-center">
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
                      <h3 className="text-[1.375rem] leading-tight [overflow-wrap:anywhere]">
                        {name}
                      </h3>
                      {item.show_email && contact.email && (
                        <a
                          className="mt-2 flex min-h-11 items-center gap-2 text-base text-link underline underline-offset-4 [overflow-wrap:anywhere]"
                          href={`mailto:${contact.email}`}
                        >
                          <Mail
                            aria-hidden="true"
                            className="shrink-0"
                            size={18}
                          />
                          {contact.email}
                        </a>
                      )}
                      {item.show_phone && contact.phone && (
                        <a
                          className="flex min-h-11 items-center gap-2 text-base text-link underline underline-offset-4"
                          href={`tel:${contact.phone}`}
                        >
                          <Phone
                            aria-hidden="true"
                            className="shrink-0"
                            size={18}
                          />
                          {contact.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
    </Section>
  );
};
