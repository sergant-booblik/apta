import type { ColorType } from '@/types/colors'

export enum ButtonType {
  BUTTON = 'button',
  SUBMIT = 'submit',
  RESET = 'reset',
}

export enum InputType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
}

export interface AlertControl {
  label: string,
  color?: ColorType,
  onClick: () => void,
}
