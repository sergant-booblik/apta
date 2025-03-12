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
  DATE = 'date',
  NUMBER = 'number',
  DATETIME = 'datetime-local',
}

export interface AlertControl {
  label: string,
  color?: ColorType,
  onClick: () => void,
}
