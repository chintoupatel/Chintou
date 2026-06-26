import { useEffect, useRef } from 'react';

interface UseTypewriterScrubProps {
  text: string;
  duration?: number;
  onComplete?: () => void;
}

export function useTypewriterScrub({
  text,
  duration = 2,
  onComplete,
}: UseTypewriterScrubProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const chars = text.split('');
    const charsPerSecond = chars.length / duration;
    const timePerChar = 1000 / charsPerSecond;
    let currentIndex = 0;
    let animationFrameId: NodeJS.Timeout;

    const animate = () => {
      currentIndex += 1;

      if (containerRef.current) {
        containerRef.current.textContent = chars.slice(0, currentIndex).join('');
      }

      if (currentIndex < chars.length) {
        animationFrameId = setTimeout(animate, timePerChar);
      } else {
        onComplete?.();
      }
    };

    animationFrameId = setTimeout(animate, timePerChar);

    return () => {
      clearTimeout(animationFrameId);
    };
  }, [text, duration, onComplete]);

  return containerRef;
}
