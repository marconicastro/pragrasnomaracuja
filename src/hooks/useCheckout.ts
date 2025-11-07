/**
 * useCheckout Hook - Gerencia fluxo de checkout
 */

'use client';

import { useState } from 'react';
import { trackLead, trackInitiateCheckout, trackAddToCart } from '@/lib/tracking';
import { saveUserData, UserData } from '@/lib/storage/user-data';
import { logger } from '@/lib/logger';

interface CheckoutFormData {
  email: string;
  phone: string;
  fullName: string;
  city?: string;
  state?: string;
  cep?: string;
}

export function useCheckout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const openModal = () => {
    // Track AddToCart quando modal abre
    trackAddToCart().catch(logger.error);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckout = async (formData: CheckoutFormData) => {
    setIsProcessing(true);

    try {
      // 1. Processar nome
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || nameParts[0];

      // 2. Preparar user data
      const userData: Partial<UserData> = {
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.replace(/\D/g, ''),
        firstName,
        lastName,
        fullName: formData.fullName.trim(),
        city: formData.city?.trim(),
        state: formData.state?.trim(),
        zip: formData.cep?.replace(/\D/g, ''),
        country: 'br'
      };

      // 3. Salvar dados localmente
      await saveUserData(userData, true);

      // 4. Tracking (paralelo)
      await Promise.all([
        trackLead(userData),
        new Promise(resolve => setTimeout(resolve, 2000)).then(() =>
          trackInitiateCheckout(userData)
        )
      ]);

      // 5. Construir URL de checkout
      const checkoutUrl = buildCheckoutUrl(userData);

      // 6. Pequeno delay para garantir tracking completo
      await new Promise(resolve => setTimeout(resolve, 500));

      // 7. Redirecionar
      window.location.href = checkoutUrl;

    } catch (error) {
      logger.error('Checkout error', error);

      // Mesmo com erro, redirecionar (não bloquear usuário)
      const checkoutUrl = buildCheckoutUrl({
        email: formData.email,
        fullName: formData.fullName,
        phone: formData.phone
      });

      window.location.href = checkoutUrl;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isModalOpen,
    isProcessing,
    openModal,
    closeModal,
    handleCheckout
  };
}

/**
 * Construir URL de checkout com parâmetros
 */
function buildCheckoutUrl(userData: Partial<UserData>): string {
  const baseUrl = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL || 
    'https://pay.cakto.com.br/hacr962_605077';

  const url = new URL(baseUrl);

  // Dados pessoais
  if (userData.fullName) url.searchParams.set('name', userData.fullName);
  if (userData.email) url.searchParams.set('email', userData.email);
  if (userData.phone) {
    const phoneWithDDI = userData.phone.startsWith('55') 
      ? userData.phone 
      : `55${userData.phone}`;
    url.searchParams.set('phone', phoneWithDDI);
  }

  // Localização
  if (userData.city) url.searchParams.set('city', userData.city);
  if (userData.state) url.searchParams.set('state', userData.state.toUpperCase());
  if (userData.zip) {
    const cleanZip = userData.zip.replace(/\D/g, '');
    url.searchParams.set('zip', cleanZip);
  }
  url.searchParams.set('country', 'BR');

  // Success URL
  url.searchParams.set('success_url', 'https://www.maracujazeropragas.com/obrigado');

  return url.toString();
}
