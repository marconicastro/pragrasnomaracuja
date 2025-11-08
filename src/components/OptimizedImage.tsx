'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'auto' | 'low';
  quality?: number; // 🚀 Add quality control
  sizes?: string; // 🚀 Override default sizes
}

export default function OptimizedImage({
  src,
  alt,
  className,
  style,
  priority = false,
  width = 200,
  height,
  loading = 'lazy',
  fetchPriority = 'auto',
  quality = 75, // 🚀 Default quality 75 (good balance)
  sizes
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleError = () => {
    setImageError(true);
    console.error(`❌ Erro ao carregar imagem: ${src}`);
  };

  const handleLoad = () => {
    setImageLoaded(true);
  };

  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={style}
      >
        <span className="text-gray-500 text-xs">Imagem não disponível</span>
      </div>
    );
  }

  // 🚀 Auto-calculate height if not provided (square images)
  const imageHeight = height || width;

  // 🚀 Optimized sizes based on width
  const defaultSizes = width <= 200 
    ? '(max-width: 640px) 100vw, 200px' // Small images
    : width <= 400 
    ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px' // Medium images
    : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'; // Large images

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={imageHeight}
      priority={priority}
      loading={priority ? 'eager' : loading}
      // @ts-ignore - Next.js supports fetchPriority
      fetchPriority={priority ? 'high' : fetchPriority}
      onError={handleError}
      onLoad={handleLoad}
      quality={quality}
      className={`transition-opacity duration-300 ${
        imageLoaded ? 'opacity-100' : 'opacity-0'
      } ${className || ''}`}
      style={style}
      sizes={sizes || defaultSizes}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
    />
  );
}