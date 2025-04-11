<template>
  <h2>{{ $t('SidePanel.Currency.title') }}</h2>
  <p class="text-gray-400 text-sm mt-1 mb-5">
    {{ $t('SidePanel.Currency.subtitle') }}
  </p>
  <h3>{{ $t('SidePanel.Currency.user') }}</h3>
  <ul class="mt-1 mb-3 flex flex-wrap currencies-list">
    <TransitionGroup name="list">
      <li
        class="mb-2 mr-2"
        :key="defaultCurrency?.id"
      >
        <PillComponent
          role="button"
          :label="`${defaultCurrency?.code} ${defaultCurrency?.flag}`"
          :title="$t('SidePanel.Currency.tooltip')"
          :color="ColorType.SECONDARY"
        />
      </li>
      <li
        v-for="currency in userCurrencies"
        :key="currency?.id"
        class="mb-2 mr-2"
      >
        <PillComponent
          v-if="currency"
          outline
          role="button"
          :label="`${currency?.code} ${currency?.flag}`"
          :control="{ color: ColorType.DANGER, icon: BIconX }"
          :color="ColorType.PRIMARY"
          @click="removeCurrency(currency?.id)"
        />
      </li>
    </TransitionGroup>
  </ul>
  <template v-if="otherPinnedCurrencies.length > 0">
    <h3>{{ $t('SidePanel.Currency.pinned') }}</h3>
    <ul class="mt-1 mb-3 flex flex-wrap currencies-list">
      <TransitionGroup name="list">
        <li
          v-for="currency in otherPinnedCurrencies"
          :key="currency.id"
          class="mb-2 mr-2"
        >
          <PillComponent
            outline
            role="button"
            :label="`${currency.code} ${currency.flag}`"
            :control="{ color: ColorType.SUCCESS, icon: BIconPlus }"
            :color="ColorType.PRIMARY"
            @click="addCurrency(currency)"
          />
        </li>
      </TransitionGroup>
    </ul>
  </template>
  <template v-if="otherUnpinnedCurrencies.length > 0">
    <h3>{{ $t('SidePanel.Currency.all') }}</h3>
    <ul class="mt-1 mb-3 flex flex-wrap currencies-list">
      <TransitionGroup name="list">
        <li
          v-for="currency in otherUnpinnedCurrencies"
          :key="currency.id"
          class="mb-2 mr-2"
        >
          <PillComponent
            outline
            role="button"
            :control="{ color: ColorType.SUCCESS, icon: BIconPlus }"
            :color="ColorType.PRIMARY"
            :label="`${currency.code} ${currency.flag}`"
            @click="addCurrency(currency)"
          />
        </li>
      </TransitionGroup>
    </ul>
  </template>
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useCurrenciesStore } from '@/store/currencies'
import { storeToRefs } from 'pinia'
import { useProfileStore } from '@/store/profile'
import type { Currency } from '@/types/currency'
import PillComponent from '@/components/PillComponent.vue'
import { ColorType } from '@/types/colors'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BIconPlus, BIconX } from 'bootstrap-icons-vue';

function useAddCurrency(): (currency: Currency) => void {
  const profileStore = useProfileStore();
  const userCurrencies = profileStore.profile?.currencies;

  function addCurrency(currency: Currency) {
    if (!profileStore.profile?.id) return;
    userCurrencies?.push(currency);
    userCurrencies?.sort((a, b) => {
      return a.id - b.id;
    });
    profileStore.updateProfile(
      {
        ...profileStore.profile,
        currencies: userCurrencies,
      }
    );
  }

  return addCurrency;
}

function useRemoveCurrency(): (id: number) => void {
  const profileStore = useProfileStore();
  const userCurrencies = profileStore.profile?.currencies;

  function removeCurrency(id: number) {
    const index = userCurrencies?.findIndex((currency) => currency.id === id);
    if (!profileStore.profile?.id || index == undefined) return;
    console.log(userCurrencies);
    userCurrencies?.splice(index, 1);
    console.log(userCurrencies);
    profileStore.updateProfile(
      {
        ...profileStore.profile,
        currencies: userCurrencies,
      }
    );
  }

  return removeCurrency;
}

const currenciesStore = useCurrenciesStore();
const profileStore = useProfileStore();

const { pinnedCurrencies, unpinnedCurrencies } = storeToRefs(currenciesStore);
const { profile } = storeToRefs(profileStore);

const defaultCurrency = computed(() => profile.value?.defaultCurrency);
const userCurrencies = computed(() => profile.value?.currencies);
const addedCurrencies = computed(() => [defaultCurrency.value].concat(userCurrencies.value));

const otherPinnedCurrencies = computed(() => {
  return pinnedCurrencies.value.filter((currency) => !addedCurrencies.value?.some((addedCurrency) => addedCurrency?.id === currency.id));
});

const otherUnpinnedCurrencies = computed(() => {
  return unpinnedCurrencies.value.filter((currency) => !addedCurrencies.value?.some((addedCurrency) => addedCurrency?.id === currency.id));
});

const addCurrency = useAddCurrency();
const removeCurrency = useRemoveCurrency();

onBeforeMount(() => {
  const currenciesStore = useCurrenciesStore();
  currenciesStore.fetchPinnedCurrencies();
  currenciesStore.fetchUnpinnedCurrencies();
});
</script>
