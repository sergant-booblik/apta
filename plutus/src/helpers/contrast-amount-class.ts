import { Sign } from '@/types/currency'

export function getContrastAmountClass(backgroundColor: string = '#1E293B', sign: Sign = Sign.NEUTRAL): string {

  const localColor = backgroundColor ?? '#1E293B'

  const r = parseInt(localColor.substring(1, 3), 16) / 255;
  const g = parseInt(localColor.substring(3, 5), 16) / 255;
  const b = parseInt(localColor.substring(5, 7), 16) / 255;

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  const isDarkBackground = luminance < 0.5;

  if (sign === Sign.POSITIVE) {
    return isDarkBackground ? 'text-lime-400' : "text-green-700";
  }

  if (sign === Sign.NEGATIVE) {
    return isDarkBackground ? 'text-red-400' : 'text-red-700';
  }

  return isDarkBackground ? 'text-slate-200' : 'text-slate-800';
}
