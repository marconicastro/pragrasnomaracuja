// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Server-side performance monitoring
  tracesSampleRate: 0.05, // 5% (menor que client)
  
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'production',
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  
  // Server-specific options
  beforeSend(event) {
    // Não enviar informações sensíveis
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }
    return event;
  },
});


