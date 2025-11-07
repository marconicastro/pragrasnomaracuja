/**
 * useTracking Hook - Gerencia tracking de eventos
 */

'use client';

import { useEffect, useRef } from 'react';
import { 
  trackPageView, 
  trackViewContent,
  trackScrollDepth 
} from '@/lib/tracking';
import { logger } from '@/lib/logger';

export function useTracking() {
  const viewContentFired = useRef(false);
  const scroll50Fired = useRef(false);
  const scroll75Fired = useRef(false);

  useEffect(() => {
    // PageView automático
    trackPageView().catch(error => {
      logger.error('Failed to track PageView', error);
    });

    // ViewContent após 2s
    const viewContentTimer = setTimeout(() => {
      if (!viewContentFired.current) {
        viewContentFired.current = true;
        trackViewContent({ trigger_type: 'page_load', time_on_page: 2 })
          .catch(error => {
            logger.error('Failed to track ViewContent', error);
          });
      }
    }, 2000);

    return () => clearTimeout(viewContentTimer);
  }, []);

  // Scroll tracking
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const scrollPercentage = Math.round((scrollPosition / scrollHeight) * 100);

        // 50% scroll
        if (scrollPercentage >= 50 && !scroll50Fired.current) {
          scroll50Fired.current = true;
          trackScrollDepth(50).catch(logger.error);
        }

        // 75% scroll
        if (scrollPercentage >= 75 && !scroll75Fired.current) {
          scroll75Fired.current = true;
          trackScrollDepth(75).catch(logger.error);
        }

        scrollTimeout = null;
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return {
    trackPageView,
    trackViewContent
  };
}
