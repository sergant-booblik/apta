import { defineAsyncComponent } from 'vue'

const FormattedAmountIcon = {
  SignPositiveIcon: defineAsyncComponent(() => import('./caret-up.svg')),
  SignNegativeIcon: defineAsyncComponent(() => import('./caret-down.svg')),
  SignNeutralIcon: defineAsyncComponent(() => import('./circle-icon.svg')),
};

export default FormattedAmountIcon;
