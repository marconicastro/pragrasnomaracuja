/**
 * Testes do useCheckout hook
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useCheckout } from '../useCheckout';
import { trackAddToCart, trackLead, trackInitiateCheckout } from '@/lib/tracking';
import { saveUserData } from '@/lib/storage/user-data';

// Mocks
jest.mock('@/lib/tracking');
jest.mock('@/lib/storage/user-data');

// Mock window.location
delete (window as any).location;
window.location = { href: '' } as any;

describe('useCheckout Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
  });

  it('should open and close modal', () => {
    const { result } = renderHook(() => useCheckout());

    expect(result.current.isModalOpen).toBe(false);

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isModalOpen).toBe(true);
    expect(trackAddToCart).toHaveBeenCalled();

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isModalOpen).toBe(false);
  });

  it('should handle checkout submission', async () => {
    const { result } = renderHook(() => useCheckout());

    const formData = {
      email: 'test@example.com',
      phone: '11999999999',
      fullName: 'João Silva',
      city: 'São Paulo',
      state: 'SP',
      cep: '01234-567'
    };

    await act(async () => {
      await result.current.handleCheckout(formData);
    });

    // Verificar se salvou dados
    expect(saveUserData).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test@example.com',
        firstName: 'João',
        lastName: 'Silva'
      }),
      true
    );

    // Verificar se disparou tracking
    expect(trackLead).toHaveBeenCalled();
    expect(trackInitiateCheckout).toHaveBeenCalled();

    // Verificar se redirecionou
    await waitFor(() => {
      expect(window.location.href).toContain('pay.cakto.com');
    });
  });

  it('should redirect even on tracking error', async () => {
    (trackLead as jest.Mock).mockRejectedValue(new Error('Tracking failed'));

    const { result } = renderHook(() => useCheckout());

    const formData = {
      email: 'test@example.com',
      phone: '11999999999',
      fullName: 'João Silva'
    };

    await act(async () => {
      await result.current.handleCheckout(formData);
    });

    // Deve redirecionar mesmo com erro
    await waitFor(() => {
      expect(window.location.href).toContain('pay.cakto.com');
    });
  });
});
