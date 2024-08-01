import { defineAsyncComponent } from 'vue';

export default {
  CurrenciesComponent: defineAsyncComponent(() => import('./CurrenciesComponent.vue')),
};
