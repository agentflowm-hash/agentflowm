'use client';

/**
 * AccentWord Component
 * Renders text with "Flow" in orange accent color and rest in muted gray
 * Following the logo pattern: Agent[Flow]Marketing
 */

interface AccentWordProps {
  left?: string;
  accent: string;
  right?: string;
  className?: string;
}

export function AccentWord({ 
  left = '', 
  accent, 
  right = '', 
  className = '' 
}: AccentWordProps) {
  return (
    <span className={className}>
      {left && <span className="text-muted-marketing">{left}</span>}
      <span className="text-accent-flow">{accent}</span>
      {right && <span className="text-muted-marketing">{right}</span>}
    </span>
  );
}

export default AccentWord;
