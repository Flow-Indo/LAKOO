/**
 * Validation utilities for forms and data
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  // Indonesian phone number validation
  const phoneRegex = /^(\+62|62|0)[8-9][0-9]{7,11}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidPostalCode = (postalCode: string): boolean => {
  // Indonesian postal code (5 digits)
  const postalRegex = /^\d{5}$/;
  return postalRegex.test(postalCode);
};

export const validateRequired = (value: unknown): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'Field ini wajib diisi';
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email wajib diisi';
  if (!isValidEmail(email)) return 'Format email tidak valid';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return 'Nomor telepon wajib diisi';
  if (!isValidPhone(phone)) return 'Format nomor telepon tidak valid';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password wajib diisi';
  if (password.length < 8) return 'Password minimal 8 karakter';
  if (!isValidPassword(password)) {
    return 'Password harus mengandung huruf besar, kecil, dan angka';
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number): string | null => {
  if (value.length < minLength) {
    return `Minimal ${minLength} karakter`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number): string | null => {
  if (value.length > maxLength) {
    return `Maksimal ${maxLength} karakter`;
  }
  return null;
};

export const validateNumeric = (value: string): string | null => {
  if (isNaN(Number(value))) {
    return 'Harus berupa angka';
  }
  return null;
};

export const validateMinValue = (value: number, minValue: number): string | null => {
  if (value < minValue) {
    return `Nilai minimal ${minValue}`;
  }
  return null;
};

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateForm = (
  data: Record<string, unknown>,
  rules: Record<string, ((value: unknown) => string | null)[]>
): ValidationResult => {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = data[field];

    for (const rule of fieldRules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });

  return { isValid, errors };
};