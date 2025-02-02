<template>
  <div class="open-bill-modal__header">
    <div class="bill-info">
      <div class="bill-info__title">
        <h2>{{ bill?.name }}</h2>
        <p>{{ bill?.subtitle }}</p>
      </div>
      <div class="bill-info__balances">
        <div class="bill-info-balance">
          <span>{{ $t('Amount.Initial') }}</span>
          {{ bill?.initialSum }}
        </div>
        <div class="bill-info-balance">
          <span>{{ $t('Amount.Income') }}</span>
          {{ bill?.incomeSum }}
        </div>
        <div class="bill-info-balance">
          <span>{{ $t('Amount.Outcome') }}</span>
          {{ bill?.outcomeSum }}
        </div>
      </div>
    </div>
    <CardComponent
      class="card bill-card"
      :style="{ backgroundColor: bill?.customColor }"
    >
      <div class="bill-card__top">
        <p>{{ bill?.name }}</p>
        <img
          v-if="bill?.customIcon"
          :src="bill?.customIcon"
          alt="icon"
        >
        <component
          v-else
          :is="`${bill?.icon}-icon`"
        />
      </div>
      <h2>{{ toMoney(bill?.amount, bill?.currency.code) }}</h2>
      <p
        v-if="bill?.transSum"
        :class="[
          'format',
          { 'format--positive': bill.transSum > 0 },
          { 'format--negative': bill.transSum < 0 },
        ]"
      >
        <Icon.CaretIcon />
        {{ toMoney(bill.transSum, bill.currency.code) }}
      </p>
    </CardComponent>
  </div>
  <div class="modal__body">
    <form enctype="multipart/form-data">
      <input
        ref="inputRef"
        type="file"
        name="icon"
        @change="uploadFile"
      >
    </form>
    <img
      :src="bill?.customIcon"
      alt="icon"
    >
    <Sketch
      v-model="bill?.customColor"
      :disable-alpha="true"
      :disable-fields="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, type Ref, ref } from 'vue';
import { useBillStore } from '@/store/bill';
import { useModalStore } from '@/store/modal';
import { storeToRefs } from 'pinia';
import type { Bill } from '@/types/bill';
import { Sketch } from '@ckpack/vue-color';
import { toMoney } from '@/helpers/to-money';
import CardComponent from '@/components/CardComponent.vue'
import Icon from '@/components/icons';


function useUploadFile(
  bill: Ref<Bill | undefined>,
  inputRef: Ref<HTMLInputElement | undefined>,
): () => void {
  const billStore = useBillStore();
  function uploadFile(): void {
    console.log(bill);
    billStore.uploadBillIcon(bill?.value, inputRef.value?.files);
  }

  return uploadFile;
}

const modalStore = useModalStore();
const billStore = useBillStore();

const inputRef = ref<HTMLInputElement>();

const { id } = storeToRefs(modalStore);

const bill = computed(() => billStore.getCertainBill(id.value));

const uploadFile = useUploadFile(bill, inputRef);
</script>
