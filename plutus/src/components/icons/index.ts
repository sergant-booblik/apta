import { defineAsyncComponent } from 'vue'

const Icon = {
  VerticalDotsIcon: defineAsyncComponent(() => import('./vertical-dots.svg')),
  CaretIcon: defineAsyncComponent(() => import('./caret.svg')),
  CircleIcon: defineAsyncComponent(() => import('./circle.svg')),
  CheckIcon: defineAsyncComponent(() => import('./check.svg')),
  CloseIcon: defineAsyncComponent(() => import('./close.svg')),
  ChangeCurrencyIcon: defineAsyncComponent(() => import('./change-currency.svg')),
  EyeIcon: defineAsyncComponent(() => import('./eye.svg')),
  EyeSlashIcon: defineAsyncComponent(() => import('./eye-slash.svg')),
  ExclamationCircleIcon: defineAsyncComponent(() => import('./exclamation-circle.svg')),
  ExternalLinkIcon: defineAsyncComponent(() => import('./external-link.svg')),
  GearIcon: defineAsyncComponent(() => import('./gear.svg')),
  ListIcon: defineAsyncComponent(() => import('./list.svg')),
  LogoIcon: defineAsyncComponent(() => import('./logo.svg')),
  PaletteIcon: defineAsyncComponent(() => import('./palette.svg')),
  PlusIcon: defineAsyncComponent(() => import('./plus.svg')),
  TransferIncomeIcon: defineAsyncComponent(() => import('./transfer-income.svg')),
  TransferOutcomeIcon: defineAsyncComponent(() => import('./transfer-outcome.svg')),
  TransferTransactionSentIcon: defineAsyncComponent(() => import('./transfer-transaction-sent.svg')),
  TransferTransactionReceivedIcon: defineAsyncComponent(() => import('./transfer-transaction-received.svg')),
  XIcon: defineAsyncComponent(() => import('./x.svg')),
};

export default Icon;
