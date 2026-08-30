import { Send } from "lucide-react";
import type { FormEvent } from "react";
import { Section } from "../layout/Section";

type ContactFormProps = {
  recipientEmail: string;
  recipientName: string;
};

export const ContactForm = ({
  recipientEmail,
  recipientName,
}: ContactFormProps): React.JSX.Element => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = `Website-Anfrage von ${formData.get("name")}`;
    const message = [
      `Name: ${formData.get("name")}`,
      `E-Mail: ${formData.get("email")}`,
      "",
      String(formData.get("message") ?? ""),
    ].join("\n");
    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  };

  return (
    <Section containerClassName="max-w-3xl">
      <div className="border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Nachricht an {recipientName}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          Direkt anfragen
        </h2>
        <form className="mt-7 grid gap-5" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-foreground">
            Name
            <input
              className="min-h-11 border border-border bg-background px-3 font-normal outline-none transition-colors focus:border-primary"
              name="name"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-foreground">
            E-Mail-Adresse
            <input
              className="min-h-11 border border-border bg-background px-3 font-normal outline-none transition-colors focus:border-primary"
              name="email"
              required
              type="email"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-foreground">
            Nachricht
            <textarea
              className="min-h-36 resize-y border border-border bg-background p-3 font-normal outline-none transition-colors focus:border-primary"
              name="message"
              required
            />
          </label>
          <label className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <input
              className="mt-1 size-4 accent-primary"
              name="privacy"
              required
              type="checkbox"
            />
            Ich stimme zu, dass mein E-Mail-Programm zur Übermittlung der
            Nachricht geöffnet wird.
          </label>
          <button
            className="inline-flex min-h-11 w-fit items-center gap-2 bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            type="submit"
          >
            E-Mail vorbereiten <Send aria-hidden="true" size={16} />
          </button>
        </form>
      </div>
    </Section>
  );
};
