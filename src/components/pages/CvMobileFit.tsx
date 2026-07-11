'use client';

import { useRef, useLayoutEffect, useState, useCallback, type ReactNode } from 'react';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

const NAV_HEIGHT_PX = 64;

interface CvMobileFitProps {
  children: ReactNode;
}

export default function CvMobileFit({ children }: CvMobileFitProps) {
  const isMobile = useIsMobile();
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | null>(null);

  const recalculate = useCallback(() => {
    if (!isMobile) {
      document.body.removeAttribute('data-cv-mobile-fit');
      setScale(1);
      setScaledHeight(null);
      return;
    }

    document.body.setAttribute('data-cv-mobile-fit', 'true');

    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const availableHeight = viewport.clientHeight;
    const naturalHeight = content.scrollHeight;

    if (naturalHeight <= 0 || availableHeight <= 0) return;

    const nextScale = Math.min(1, availableHeight / naturalHeight);
    setScale(nextScale);
    setScaledHeight(naturalHeight * nextScale);
  }, [isMobile]);

  useLayoutEffect(() => {
    recalculate();

    window.addEventListener('orientationchange', recalculate);

    const resizeObserver = new ResizeObserver(recalculate);
    const content = contentRef.current;
    const viewport = viewportRef.current;
    if (content) resizeObserver.observe(content);
    if (viewport) resizeObserver.observe(viewport);

    if (document.fonts?.ready) {
      document.fonts.ready.then(recalculate);
    }

    return () => {
      window.removeEventListener('orientationchange', recalculate);
      resizeObserver.disconnect();
      document.body.removeAttribute('data-cv-mobile-fit');
    };
  }, [recalculate]);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div
      ref={viewportRef}
      className="cv-mobile-viewport w-full overflow-hidden px-2"
      style={{ height: `calc(100dvh - ${NAV_HEIGHT_PX}px)` }}
    >
      <div
        className="mx-auto overflow-hidden"
        style={scaledHeight !== null ? { height: scaledHeight } : undefined}
      >
        <div
          ref={contentRef}
          style={{
            transform: scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
