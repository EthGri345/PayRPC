'use client';

import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'bash' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="glass-strong rounded-xl p-6 font-mono text-sm overflow-x-auto">
        <div className="flex items-start justify-between gap-4">
          <pre className="text-text-muted flex-1">
            <code>{code}</code>
          </pre>
          <button
            onClick={copyToClipboard}
            className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded-lg bg-surface hover:bg-surface-light text-xs text-text-subtle hover:text-text"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
