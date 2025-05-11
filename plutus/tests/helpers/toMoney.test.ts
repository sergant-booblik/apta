import { describe, it, expect, vi } from 'vitest';
import { toMoney } from '@/helpers/to-money';

vi.mock('@/store/profile', () => ({
  useProfileStore: vi.fn(() => ({
    profile: {
      locale: 'en-US',
    },
  })),
}));

describe('toMoney', () => {
  it('should return an empty string if amount or currency is undefined', () => {
    expect(toMoney(undefined, 'USD')).toBe('');
    expect(toMoney(100, undefined)).toBe('');
    expect(toMoney(undefined, undefined)).toBe('');
  });

  it('should return formatted currency string based on locale', () => {
    expect(toMoney(1000, 'USD')).toBe('$1,000.00');
  });
});
