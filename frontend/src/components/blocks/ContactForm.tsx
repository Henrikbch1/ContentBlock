import { Send } from "lucide-react";
import type { FormEvent } from "react";
import { cn } from "../../lib/utils";
import { noticeClassName } from "../common/cardClassName";
import { NoticeMeta } from "../common/NoticeMeta";

const INPUT_CLASS =
  "min-h-12 rounded-card border border-input bg-background px-3 text-base font-normal transition-colors focus:border-primary";

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
    <div className={noticeClassName("max-w-3xl sm:px-8 sm:pb-8")}>
      <NoticeMeta label="Nachricht an" value={recipientName} />
      <h3 className="text-[1.75rem] leading-tight">Direkt anfragen</h3>
      <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-base font-bold text-foreground">
          Name
          <input className={INPUT_CLASS} name="name" required />
        </label>
        <label className="grid gap-2 text-base font-bold text-foreground">
          E-Mail-Adresse
          <input className={INPUT_CLASS} name="email" required type="email" />
        </label>
        <label className="grid gap-2 text-base font-bold text-foreground">
          Nachricht
          <textarea
            className={cn(INPUT_CLASS, "min-h-36 resize-y p-3")}
            name="message"
            required
          />
        </label>
        <label className="flex items-start gap-3 text-base leading-7 text-foreground">
          <input
            className="mt-0.5 size-6 shrink-0 accent-primary"
            name="privacy"
            required
            type="checkbox"
          />
          Ich stimme zu, dass mein E-Mail-Programm zur Übermittlung der
          Nachricht geöffnet wird.
        </label>
        <button
          className="inline-flex min-h-12 w-fit items-center gap-2 rounded-card bg-primary px-6 text-base font-bold text-primary-foreground transition-colors hover:bg-primary-hover"
          type="submit"
        >
          E-Mail vorbereiten <Send aria-hidden="true" size={18} />
        </button>
      </form>
    </div>
  );
};
