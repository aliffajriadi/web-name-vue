"use client";

import { Fragment, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { common, createLowlight } from "lowlight";

const lowlight = createLowlight(common);

type Hast = { type: string; value?: string; tagName?: string; properties?: { className?: string[] }; children?: Hast[] };

function toReact(node: Hast, key: number): ReactNode {
  if (node.type === "text") return node.value;
  if (node.type === "element") {
    return (
      <span key={key} className={node.properties?.className?.join(" ")}>
        {node.children?.map(toReact)}
      </span>
    );
  }
  return <Fragment key={key}>{node.children?.map(toReact)}</Fragment>;
}

/** Code block with a language label, copy button and syntax highlighting. */
export default function CodeBlock({ language, code }: { language?: string; code: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => {
    if (!language || !lowlight.registered(language)) return null;
    try {
      return lowlight.highlight(language, code).children as Hast[];
    } catch {
      return null;
    }
  }, [language, code]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — silently ignore */
    }
  };

  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span className="code-block__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span>{language || "code"}</span>
        <button type="button" onClick={copy} className="code-block__copy" aria-label="Copy code">
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre ref={ref}>
        <code>{highlighted ? highlighted.map(toReact) : code}</code>
      </pre>
    </div>
  );
}
