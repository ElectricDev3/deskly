"use client";

import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "./ui/Button";

export function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const url = `${origin}/${slug}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="rounded bg-brand-light px-2.5 py-1.5 font-mono text-sm text-brand-dark">/{slug}</code>
      <Button type="button" variant="secondary" onClick={handleCopy}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copiado" : "Copiar"}
      </Button>
      <a href={`/${slug}`} target="_blank" rel="noopener noreferrer">
        <Button type="button" variant="ghost">
          <ExternalLink size={14} /> Ver página
        </Button>
      </a>
    </div>
  );
}
