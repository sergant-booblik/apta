import { defineAsyncComponent } from 'vue'

const Icon = {
  LogoIcon: defineAsyncComponent(() => import('./logo.svg')),

  CaretDown: defineAsyncComponent(() => import('./caret-down.svg')),
  CaretUp: defineAsyncComponent(() => import('./caret-up.svg')),
  Dot: defineAsyncComponent(() => import('./dot.svg')),

  Expenses: defineAsyncComponent(() => import('./expenses.svg')),

  TransferIncomeIcon: defineAsyncComponent(() => import('./transfer-income.svg')),
  TransferOutcomeIcon: defineAsyncComponent(() => import('./transfer-outcome.svg')),
  TransferTransactionSentIcon: defineAsyncComponent(() => import('./transfer-transaction-sent.svg')),
  TransferTransactionReceivedIcon: defineAsyncComponent(() => import('./transfer-transaction-received.svg')),
};

export default Icon;
