import type { BlockTicker } from "../../lib/types";

export const TickerBlock = ({ item }: { item: BlockTicker }): React.JSX.Element | null => {
  const messages = item.messages?.filter((message) => message.text) ?? [];
  if (!messages.length) return null;
  const style = { backgroundColor: item.background_color || undefined, color: item.text_color || undefined };
  return <div aria-label="Laufende Meldungen" className="overflow-hidden border-y border-border" role="region" style={style}>
    <style>{`@keyframes ticker-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } } .ticker-track { animation: ticker-scroll 28s linear infinite; } @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }`}</style>
    <div className="ticker-track flex w-max gap-12 whitespace-nowrap px-6 py-3 text-sm font-medium">
      {[...messages, ...messages].map((message, index) => message.link ? <a href={message.link} key={`${message.id ?? message.text}-${index}`} className="hover:underline">{message.text}</a> : <span key={`${message.id ?? message.text}-${index}`}>{message.text}</span>)}
    </div>
  </div>;
};
