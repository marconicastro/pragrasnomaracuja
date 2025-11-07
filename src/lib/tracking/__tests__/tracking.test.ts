/**
 * Testes do sistema de tracking
 */

import { trackEvent, trackLead, trackPageView } from '../index';
import { sendToGTM } from '../gtm';
import { getUserData } from '../../storage/user-data';

// Mocks
jest.mock('../gtm');
jest.mock('../../storage/user-data');

describe('Tracking System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('should track event with user data', async () => {
      const mockUserData = {
        email: 'test@example.com',
        phone: '5511999999999',
        firstName: 'John',
        lastName: 'Doe',
        sessionId: 'sess_123'
      };

      (getUserData as jest.Mock).mockReturnValue(mockUserData);

      await trackEvent('test_event', { value: 100 });

      expect(sendToGTM).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'test_event',
          value: 100,
          user_data: expect.objectContaining({
            email: 'test@example.com',
            user_id: 'sess_123'
          })
        })
      );
    });

    it('should generate event_id if not provided', async () => {
      (getUserData as jest.Mock).mockReturnValue({});

      await trackEvent('test_event');

      expect(sendToGTM).toHaveBeenCalledWith(
        expect.objectContaining({
          event_id: expect.stringContaining('test_event_')
        })
      );
    });

    it('should not throw on tracking error', async () => {
      (sendToGTM as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(trackEvent('test_event'))
        .resolves
        .not.toThrow();
    });
  });

  describe('trackLead', () => {
    it('should track lead with complete user data', async () => {
      const userData = {
        email: 'lead@example.com',
        phone: '5511999999999',
        firstName: 'Jane',
        lastName: 'Smith'
      };

      await trackLead(userData);

      expect(sendToGTM).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'generate_lead',
          value: 15.0,
          currency: 'BRL',
          user_data: expect.objectContaining({
            email: 'lead@example.com'
          })
        })
      );
    });
  });

  describe('trackPageView', () => {
    it('should track page view with default params', async () => {
      (getUserData as jest.Mock).mockReturnValue(null);

      await trackPageView();

      expect(sendToGTM).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'page_view',
          value: 39.9,
          currency: 'BRL'
        })
      );
    });
  });
});
