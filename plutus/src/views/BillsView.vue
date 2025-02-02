<template>
  <div class="body__header">
    <h1>{{ $t('Accounts') }}</h1>
    <div
      class="body__header-action"
      @click="changeCurrentRate"
    >
      <h2> {{ totalAmount }} </h2>
      <ChangeCurrencyIcon />
    </div>
  </div>
  <div
    v-if="!loading"
    class="body__inner"
  >
    <CardComponent
      v-for="bill in bills"
      :key="bill.id"
      class="card bill-card"
      @click="openModal('open-bill', bill.id)"
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
    <CardComponent
      class="card bill-card bill-card--add"
      @click="openModal('add-bill')"
    >
      +
    </CardComponent>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {toMoney} from "@/helpers/to-money";
import {storeToRefs} from 'pinia';
import {useBillStore} from '@/store/bill';
import {useAuthStore} from '@/store/auth';
import {useUserStore} from '@/store/user';
import {useModalStore} from '@/store/modal';
import { ModalType } from '@/types/modal';
import CardComponent from "@/components/CardComponent.vue";
import Icons from '@/components/icons';
import BillIcon from "@/components/icons/bill";

function openModal(
  type: ModalType,
  id?: number | string,
): void {
  const modalStore = useModalStore();
  modalStore.setModal(type, id);
}

const BillsView = defineComponent({
  components: {
    CardComponent,
    CaretIcon: Icons.CaretIcon,
    ChangeCurrencyIcon: Icons.ChangeCurrencyIcon,
    ...BillIcon,
  },
  beforeRouteEnter() {
    const authStore = useAuthStore();
    const userStore = useUserStore();
    const billStore = useBillStore();
    if (!billStore.hasBills && authStore.isAuth) {
      billStore.fetchBills(userStore.profile?.id);
    }
  },
  setup() {
    const userStore = useUserStore();
    const billStore = useBillStore();
    const { settings } = storeToRefs(userStore);
    const { bills, totals, loading } = storeToRefs(billStore);

    const currentCurrencyIndex = ref(0);
    const currentCurrency = computed(() => settings.value?.currencies[currentCurrencyIndex.value]);

    const totalAmount = computed(() => toMoney(totals.value[currentCurrency.value?.code], currentCurrency.value?.code));

    const changeCurrentRate = () => {
      if (currentCurrencyIndex.value === settings.value?.currencies.length - 1) {
        currentCurrencyIndex.value = 0;
      } else {
        currentCurrencyIndex.value++;
      }
    };

    return {
      bills,
      loading,
      totalAmount,
      currentCurrency,
      changeCurrentRate,
      toMoney,
      openModal,
    };
  },
});

export default BillsView;
</script>
