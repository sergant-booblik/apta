<template>
  <div class="modal__wrapper">
    <div
      ref="modalRef"
      class="modal"
    >
      <CloseIcon
        role="button"
        class="modal__close"
        @click="closeModal()"
      />
      <component
        v-if="type"
        :is="`${type}-modal`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { useModalStore } from '@/store/modal';
import Icon from '@/components/icons';
import Modal from "@/components/modal";

function closeModal(): void {
  const modalStore = useModalStore();
  modalStore.removeModal();
}

const ModalComponent = defineComponent({
  components: {
    ...Modal,
    CloseIcon: Icon.CloseIcon,
  },
  setup() {
    const modalStore = useModalStore();
    const { type } = storeToRefs(modalStore);

    const modalRef = ref<HTMLElement>();

    onClickOutside(modalRef, () => modalStore.removeModal());

    return {
      closeModal,
      type,
      modalRef,
    };
  },
});

export default ModalComponent;
</script>
