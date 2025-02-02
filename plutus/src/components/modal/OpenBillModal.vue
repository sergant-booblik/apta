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
          <FormattedAmount
            :sum="bill?.initialSum"
            :currency-code="bill?.currency.code"
            sign="neutral"
          />
        </div>
        <div class="bill-info-balance">
          <span>{{ $t('Amount.Income') }}</span>
          <FormattedAmount
            :sum="bill?.incomeSum"
            :currency-code="bill?.currency.code"
            sign="positive"
          />
        </div>
        <div class="bill-info-balance">
          <span>{{ $t('Amount.Outcome') }}</span>
          <FormattedAmount
            :sum="bill?.outcomeSum"
            :currency-code="bill?.currency.code"
            sign="negative"
          />
        </div>
      </div>
    </div>
    <CardComponent
      class="card bill-card"
      :style="{ backgroundColor: bill.customColor }"
    >
      <div class="bill-card__top">
        <p>{{ bill.name }}</p>
        <img
          v-if="bill.customIcon"
          :src="bill.customIcon"
        >
        <component
          v-else
          :is="`${bill.icon}-icon`"
        />
      </div>
      <h2>{{ toMoney(bill.amount, bill.currency.code) }}</h2>
      <p
        :class="[
          'format',
          { 'format--positive': bill.transSum > 0 },
          { 'format--negative': bill.transSum < 0 },
        ]"
      >
        <CaretIcon />
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
    <img :src="bill.customIcon">
    <ColorPicker
      v-model="bill.customColor"
      :disable-alpha="true"
      :disable-fields="true"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, type Ref, ref } from 'vue';
import { useBillStore } from '@/store/bill';
import { useModalStore } from '@/store/modal';
import { storeToRefs } from 'pinia';
import BillIcon from '@/components/icons/bill';
import type { Bill } from '@/types/bill';
import { Sketch } from '@ckpack/vue-color';
import { toMoney } from '../../helpers/to-money';
import FormattedAmount from '@/components/elements/FormattedAmount.vue';
import CardComponent from '@/components/CardComponent.vue'


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

const AddBillModal = defineComponent({
  methods: { toMoney },
  components: {
    CardComponent,
    ColorPicker: Sketch,
    FormattedAmount,
    ...BillIcon,
  },
  setup() {
    const modalStore = useModalStore();
    const billStore = useBillStore();

    const inputRef = ref<HTMLInputElement>();

    const { id } = storeToRefs(modalStore);

    const bill = computed(() => billStore.getCertainBill(id.value));

    const uploadFile = useUploadFile(bill, inputRef);

    return {
      inputRef,
      bill,
      uploadFile,
    };
  },
});

export default AddBillModal;
</script>
