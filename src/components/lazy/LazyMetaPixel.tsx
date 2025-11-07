/**
 * 🚀 Lazy Loaded Meta Pixel Component
 * 
 * Carrega o Meta Pixel apenas quando necessário
 * - Code splitting automático
 * - Suspense boundary
 * - Error boundary
 */

'use client';

import React, { Suspense, lazy } from 'react';
import { logger } from '@/lib/utils/logger';

// Lazy load do componente Meta Pixel
const MetaPixelLoader = lazy(() => 
  import('@/components/MetaPixel').catch(err => {
    logger.error('Failed to load MetaPixel component', { error: err });
    // Retornar componente vazio em caso de erro
    return { default: () => null };
  })
);

// Fallback enquanto carrega
function MetaPixelFallback() {
  return null; // Não mostra nada enquanto carrega
}

// Error boundary para o lazy loading
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('LazyMetaPixel error boundary caught error', {
      error: error.message,
      componentStack: errorInfo.componentStack
    });
  }

  render() {
    if (this.state.hasError) {
      return null; // Não mostra nada em caso de erro
    }

    return this.props.children;
  }
}

// Componente exportado
export function LazyMetaPixel() {
  return (
    <LazyErrorBoundary>
      <Suspense fallback={<MetaPixelFallback />}>
        <MetaPixelLoader />
      </Suspense>
    </LazyErrorBoundary>
  );
}

