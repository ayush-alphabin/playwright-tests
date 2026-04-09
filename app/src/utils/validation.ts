export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) return { valid: false, error: 'Email is required' };
  if (email.length > 254) return { valid: false, error: 'Email is too long' };

  const parts = email.split('@');
  if (parts.length !== 2) return { valid: false, error: 'Invalid email format' };

  const [local, domain] = parts;
  if (!local || local.length > 64) return { valid: false, error: 'Invalid email local part' };
  if (!domain || !domain.includes('.')) return { valid: false, error: 'Invalid email domain' };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { valid: false, error: 'Invalid email format' };

  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) errors.push('Must be at least 8 characters');
  if (password.length > 128) errors.push('Must be no more than 128 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must contain an uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Must contain a lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Must contain a number');
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Must contain a special character');

  return { valid: errors.length === 0, errors };
}

export function validateCreditCard(number: string): { valid: boolean; type?: string; error?: string } {
  const cleaned = number.replace(/[\s-]/g, '');
  if (!/^\d+$/.test(cleaned)) return { valid: false, error: 'Card number must contain only digits' };
  if (cleaned.length < 13 || cleaned.length > 19) return { valid: false, error: 'Invalid card number length' };

  // Luhn algorithm
  let sum = 0;
  let alternate = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alternate = !alternate;
  }

  if (sum % 10 !== 0) return { valid: false, error: 'Invalid card number (checksum)' };

  let type: string | undefined;
  if (/^4/.test(cleaned)) type = 'Visa';
  else if (/^5[1-5]/.test(cleaned)) type = 'Mastercard';
  else if (/^3[47]/.test(cleaned)) type = 'Amex';
  else if (/^6011/.test(cleaned)) type = 'Discover';

  return { valid: true, type };
}

export function validatePhone(phone: string): { valid: boolean; error?: string } {
  const cleaned = phone.replace(/[\s\-()+]/g, '');
  if (!/^\d{7,15}$/.test(cleaned)) return { valid: false, error: 'Invalid phone number' };
  return { valid: true };
}

export function validateZipCode(zip: string, country: string = 'US'): { valid: boolean; error?: string } {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    UK: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i,
    CA: /^[A-Z]\d[A-Z]\s*\d[A-Z]\d$/i,
  };

  const pattern = patterns[country];
  if (!pattern) return { valid: true }; // unknown country, skip validation
  if (!pattern.test(zip)) return { valid: false, error: `Invalid ${country} postal code` };
  return { valid: true };
}
