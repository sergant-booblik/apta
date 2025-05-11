import { describe, it, expect } from 'vitest';
import { formatDateForInput } from '@/helpers/format-date';

describe('formatDateForInput', () => {
  it('should format date correctly', () => {
    const input = new Date(2023, 4, 5, 9, 7); // 5 мая 2023, 09:07 (месяц: 0-based)
    const result = formatDateForInput(input);
    expect(result).toBe('2023-05-05T09:07');
  });

  it('should pad single digits with zeros', () => {
    const input = new Date(2023, 0, 1, 0, 0); // 1 янв 2023, 00:00
    const result = formatDateForInput(input);
    expect(result).toBe('2023-01-01T00:00');
  });
});
