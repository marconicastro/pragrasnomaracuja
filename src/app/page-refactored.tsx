/**
 * Landing Page - REFATORADA (< 100 linhas)
 * Antes: 1290 linhas | Depois: ~80 linhas
 */

'use client';

import { HeroSection } from '@/components/sections/HeroSection';
import { CheckoutSection } from '@/components/sections/CheckoutSection';
import { UrgencyBar } from '@/components/UrgencyBar';
import { PreCheckoutModal } from '@/components/PreCheckoutModal';
import { useTracking } from '@/hooks/useTracking';
import { useCheckout } from '@/hooks/useCheckout';

export default function LandingPage() {
  // Tracking automático (PageView, ViewContent, Scroll)
  useTracking();

  // Checkout flow
  const {
    isModalOpen,
    isProcessing,
    openModal,
    closeModal,
    handleCheckout
  } = useCheckout();

  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <UrgencyBar />
      
      <HeroSection onCtaClick={scrollToCheckout} />
      
      {/* TODO: Adicionar outras seções aqui
        - PainAgitationSection
        - SolutionSection
        - ResultsSection
        - UrgencySection
      */}
      
      <CheckoutSection onCheckoutClick={openModal} />
      
      <PreCheckoutModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCheckout}
        isProcessing={isProcessing}
      />
    </div>
  );
}
