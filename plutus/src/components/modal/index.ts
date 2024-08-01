import { defineAsyncComponent } from 'vue';

export default {
  AddBillModal: defineAsyncComponent(() => import('./AddBillModal.vue')),
  OpenBillModal: defineAsyncComponent(() => import('./OpenBillModal.vue')),
};
