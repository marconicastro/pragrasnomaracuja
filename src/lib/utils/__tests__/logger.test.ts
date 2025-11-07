/**
 * 🧪 Unit Tests: Logger
 * 
 * Testes para o sistema de logging
 */

import { logger } from '../logger';

// Mock console methods
const mockConsole = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

global.console = mockConsole as any;

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('log', () => {
    it('should log message with data', () => {
      logger.log('Test message', { key: 'value' });
      expect(mockConsole.log).toHaveBeenCalled();
    });

    it('should handle message without data', () => {
      logger.log('Simple message');
      expect(mockConsole.log).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should log warning with data', () => {
      logger.warn('Warning message', { warning: 'details' });
      expect(mockConsole.warn).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should log error with data', () => {
      logger.error('Error message', { error: 'details' });
      expect(mockConsole.error).toHaveBeenCalled();
    });

    it('should handle Error objects', () => {
      const error = new Error('Test error');
      logger.error('Error occurred', { error });
      expect(mockConsole.error).toHaveBeenCalled();
    });
  });

  describe('info', () => {
    it('should log info message', () => {
      logger.info('Info message', { info: 'details' });
      expect(mockConsole.info).toHaveBeenCalled();
    });
  });

  describe('debug', () => {
    it('should log debug message in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      logger.debug('Debug message', { debug: 'details' });
      expect(mockConsole.debug).toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('group', () => {
    it('should create a log group', () => {
      logger.group('Test Group', () => {
        logger.log('Inside group');
      });
      
      expect(mockConsole.log).toHaveBeenCalled();
    });
  });
});
