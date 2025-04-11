<template>
  <div class="body__header">
    <h1>{{ t('Bills.title') }}</h1>
    <div
      class="body__header-action"
      @click="changeCurrentRate"
    >
      <h2 v-if="!loadingTotal"> {{ toMoney(total?.amount, total?.currencyCode) }} </h2>
      <BIconCurrencyExchange />
    </div>
  </div>
  <div class="body__controls">
    <ButtonComponent
      :label=" isShowClosedAccounts ? t('Bills.Controls.hide') : t('Bills.Controls.show')"
      :append-icon="isShowClosedAccounts ? BIconEye : BIconEyeSlash"
      :color="ColorType.SECONDARY"
      @click="toggleClosedAccounts"
    />
    <ButtonComponent
      :label="t('Bills.Controls.add')"
      :append-icon="BIconPlus"
      :color="ColorType.PRIMARY"
    />
  </div>
  <draggable
    v-if="!loadingBills"
    :list="bills"
    handle=".drag-icon"
    class="body__inner"
    @change="(event) => setNewOrder(event.moved.element.id, event.moved.newIndex + 1)"
  >
    <CardComponent
      v-for="bill in bills"
      :key="bill.id"
      :class="[
        'bill-card',
        { 'bill-card--hidden': bill.isClosed },
      ]"
      @click="openModal(ModalType.OPEN_BILL, bill.id)"
      @mousedown="isIconGrabbing = true"
      @mouseup="isIconGrabbing = false"
      :style="{
        backgroundColor: bill.customColor,
        color: bill.customFontColor,
      }"
    >
      <div class="flex items-center gap-4">
        <BIconList
          class="drag-icon"
          :class="{ 'drag-icon--grabbing': isIconGrabbing }"
        />
        <div
          v-if="bill?.customIcon"
          class="bill-card__icon"
        >
          <img
            :src="bill?.customIcon"
            alt="icon"
          >
        </div>
        <div>
          <p class="flex gap-2 items-center">
            <BIconEyeSlash
              v-if="bill.isClosed"
              class="hidden-icon"
            />
            {{ bill.name }}
          </p>
          <p class="text-sm opacity-60">{{ bill.subtitle }}</p>
        </div>
      </div>
      <div class="ms-auto flex flex-col items-end">
        <h2>{{ toMoney(bill.currentAmount, bill.currency.code) }}</h2>
        <FormattedAmount
          :currency-code="bill.currency.code"
          :sum="bill.transSum"
          :background-color="bill.customColor"
        />
      </div>
    </CardComponent>
    <CardComponent
      class="card bill-card bill-card--add"
      @click="openModal(ModalType.ADD_BILL)"
    >
      <BIconPlus />
      {{ t('Bills.Controls.add') }}
    </CardComponent>
  </draggable>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import { toMoney } from '@/helpers/to-money'
import { storeToRefs } from 'pinia'
import { useBillStore } from '@/store/bill'
import { useProfileStore } from '@/store/profile'
import { useModalStore } from '@/store/modal'
import { ModalType } from '@/types/modal'
import { VueDraggableNext as draggable } from 'vue-draggable-next';
import { BIconCurrencyExchange, BIconEye, BIconEyeSlash, BIconList, BIconPlus } from 'bootstrap-icons-vue'
import CardComponent from '@/components/CardComponent.vue'
import FormattedAmount from '@/components/elements/FormattedAmount.vue'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { useI18n } from 'vue-i18n'
import { ColorType } from '@/types/colors'

function openModal(
  type: ModalType,
  id?: number | string,
): void {
  const modalStore = useModalStore();
  modalStore.setModal(type, id);
}

function toggleClosedAccounts(): void {
  isShowClosedAccounts.value = !isShowClosedAccounts.value;
}

function setNewOrder(billId: number, newOrder: number): void {
  billStore.reorderBills(
    billId,
    newOrder,
  );
}

const { t } = useI18n();

const profileStore = useProfileStore();
const billStore = useBillStore();
const { profile } = storeToRefs(profileStore);
const { bills, total, loadingBills, loadingTotal } = storeToRefs(billStore);

const isShowClosedAccounts = ref(false);
const currentCurrencyIndex = ref(0);
const isIconGrabbing = ref(false);
const currentCurrency = computed(() => {
  if (profile.value?.currencies) {
    return profile.value?.currencies[currentCurrencyIndex.value];
  }
});

const changeCurrentRate = () => {
  if (profile.value?.currencies && currentCurrencyIndex.value === profile.value?.currencies.length - 1) {
    currentCurrencyIndex.value = 0;
  } else {
    currentCurrencyIndex.value++;
  }
};

onBeforeMount(() => {
  const billStore = useBillStore();
  if (!billStore.hasBills) {
    billStore.fetchBills();
    billStore.fetchTotalSum(currentCurrency.value?.code);
  }
});

watch(currentCurrency, (newCurrency) => {
  billStore.fetchTotalSum(newCurrency?.code);
});

watch(isShowClosedAccounts, (newValue) => {
  billStore.fetchBills(newValue);
  billStore.fetchTotalSum(currentCurrency.value?.code, newValue);
});
</script>
