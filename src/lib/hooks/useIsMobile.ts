'use client';

import { useLayoutEffect, useState } from 'react';

const MOBILE_MAX_WIDTH = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_MAX_WIDTH);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

export { MOBILE_MAX_WIDTH };
