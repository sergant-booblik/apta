import { describe, expect, it } from 'vitest';
import { getContrastAmountClass } from '@/helpers/contrast-amount-class';
import { DEFAULT_BG_COLOR } from '@/types/colors';
import { Sign } from '@/types/currency';

describe('getContrastAmountClass', () => {
  it('should return default class name for light background', () => {
    const backgroundColor = DEFAULT_BG_COLOR.LIGHT;
    const result = getContrastAmountClass(backgroundColor);
    expect(result).toBe('text-slate-800');
  });

  it('should return default class name for dark background', () => {
    const backgroundColor = DEFAULT_BG_COLOR.DARK;
    const result = getContrastAmountClass(backgroundColor);
    expect(result).toBe('text-slate-200');
  });

  it('should return positive class name for light background', () => {
    const backgroundColor = DEFAULT_BG_COLOR.LIGHT;
    const result = getContrastAmountClass(backgroundColor, Sign.POSITIVE);
    expect(result).toBe('text-green-700');
  });

  it('should return positive class name for dark background', () => {
    const backgroundColor = DEFAULT_BG_COLOR.DARK;
    const result = getContrastAmountClass(backgroundColor, Sign.POSITIVE);
    expect(result).toBe('text-lime-400');
  });

  it('should return negative class name for light background', () => {
    const backgroundColor = DEFAULT_BG_COLOR.LIGHT;
    const result = getContrastAmountClass(backgroundColor, Sign.NEGATIVE);
    expect(result).toBe('text-red-700');
  });

  it('should return negative class name for dark background', () => {
    const backgroundColor = DEFAULT_BG_COLOR.DARK;
    const result = getContrastAmountClass(backgroundColor, Sign.NEGATIVE);
    expect(result).toBe('text-red-400');
  });
});
