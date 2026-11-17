"use client";

import Link from "next/link";
import { traccia, type Evento, type ProprietaEvento } from "@/lib/analytics";

interface TrackedLinkProps {
  href: string;
  /** Optional: links without a defined event stay untracked. */
  evento?: Evento;
  props?: ProprietaEvento;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  id?: string;
  /** Static file to download (e.g. /risorse/x.xlsx): rendered as a plain anchor with the download attribute. */
  download?: boolean;
}

/** Link that sends a Vercel Analytics event on click. External URLs open as plain anchors. */
export default function TrackedLink({ href, evento, props, className, style, children, id, download }: TrackedLinkProps) {
  const onClick = evento ? () => traccia(evento, props) : undefined;
  const isExternal = /^https?:\/\//.test(href);
  const isApi = href.startsWith("/api/");

  if (isExternal || isApi || download) {
    return (
      <a
        id={id}
        href={href}
        onClick={onClick}
        download={download || undefined}
        className={className}
        style={style}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link id={id} href={href} onClick={onClick} className={className} style={style}>
      {children}
    </Link>
  );
}
