export enum Sign {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
  NONE = 'none',
}

export interface Currency {
  id: number,
  code: string,
  num: string,
  flag: string,
}
