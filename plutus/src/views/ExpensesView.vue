<template>
  <div class="body__header">
    <h1>{{ t('Expenses') }}</h1>
    <ButtonComponent
      label="!Add Expense!"
      @click="modalStore.setModal(ModalType.ADD_EXPENSE)"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { useModalStore } from '@/store/modal';
import { ModalType } from '@/types/modal';

const { t } = useI18n();

const modalStore = useModalStore();
</script>

<style scoped lang="scss">
.body__header {
  @apply flex items-center justify-between;
  @apply mb-8;
}
</style>