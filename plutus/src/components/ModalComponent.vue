<template>
  <div class="modal__wrapper">
    <div
      ref="modalRef"
      class="modal"
    >
      <BIconXLg
        role="button"
        class="modal__close"
        @click="closeModal()"
      />
      <component
        :is="ModalComponent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useModalStore } from '@/store/modal'
import { BIconXLg } from 'bootstrap-icons-vue';
import Modal from '@/components/modal'
import { ModalType } from '@/types/modal'

function closeModal(): void {
  const modalStore = useModalStore();
  modalStore.removeModal();
}

const modalStore = useModalStore();
const { type } = storeToRefs(modalStore);

const modalRef = ref<HTMLElement>();

const ModalComponent = computed(() => {
  switch (type.value) {
    case ModalType.ADD_BILL:
      return Modal.AddBillModal;
    case ModalType.OPEN_BILL:
      return Modal.OpenBillModal;
    case ModalType.ADD_EXPENSE:
      return Modal.AddExpenseModal;
    default:
      throw new Error(`Unrecognized ${type.value} modal type`);
  }
})

onClickOutside(modalRef, () => modalStore.removeModal());
</script>
