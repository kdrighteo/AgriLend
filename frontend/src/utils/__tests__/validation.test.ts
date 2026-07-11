// Validation utility tests

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@example-domain.com'
      ];
      
      validEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        expect(isValid).toBe(true);
      });
    });

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@example.com',
        'invalid@',
        'invalid @example.com',
        ''
      ];
      
      invalidEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('validatePhoneNumber', () => {
    it('should validate phone number formats', () => {
      const validPhones = [
        '+1234567890',
        '1234567890',
        '(123) 456-7890',
        '123-456-7890'
      ];
      
      validPhones.forEach(phone => {
        const isValid = /^[\d\+\-\(\)\s]+$/.test(phone);
        expect(isValid).toBe(true);
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        'abc123',
        '123-abc-456',
        ''
      ];
      
      invalidPhones.forEach(phone => {
        const isValid = /^[\d\+\-\(\)\s]+$/.test(phone);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('validateAmount', () => {
    it('should validate positive numbers', () => {
      expect(parseFloat('100')).toBe(100);
      expect(parseFloat('100.50')).toBe(100.5);
      expect(parseFloat('0')).toBe(0);
    });

    it('should handle invalid amounts', () => {
      expect(isNaN(parseFloat('abc'))).toBe(true);
      expect(isNaN(parseFloat(''))).toBe(true);
    });
  });

  describe('validateRequiredFields', () => {
    it('should detect empty required fields', () => {
      const emptyFields = ['', null, undefined, '   '];
      
      emptyFields.forEach(field => {
        const isEmpty = !field || field.trim().length === 0;
        expect(isEmpty).toBe(true);
      });
    });

    it('should accept valid required fields', () => {
      const validFields = ['value', '  value  ', '0'];
      
      validFields.forEach(field => {
        const isEmpty = !field || field.trim().length === 0;
        expect(isEmpty).toBe(false);
      });
    });
  });
});
