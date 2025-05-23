<template>
  <div class="currency__header">
    <div class="currency__title">
      <h2>{{ $t('SidePanel.Currency.title') }}</h2>
      <p class="currency__subtitle text-sm mt-1 mb-5">
        {{ $t('SidePanel.Currency.subtitle') }}
      </p>
    </div>
    <div class="currency__controls">
      <InputComponent
        v-model="filter"
        :placeholder="t('Currency.Search.placeholder')"
        :append-icon="BIconSearch"
      />
    </div>
  </div>
  <h3>{{ $t('SidePanel.Currency.user') }}</h3>
  <ul class="mt-1 mb-3 flex flex-wrap currencies-list">
    <TransitionGroup name="list">
      <li
        class="mb-2 mr-2"
        :key="defaultCurrency?.id"
      >
        <PillComponent
          role="button"
          :label="`${defaultCurrency?.flag} ${$t(`Currency.Name.${defaultCurrency?.code}`)}`"
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
          :label="`${currency?.flag} ${$t(`Currency.Name.${currency?.code}`)}`"
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
            :label="`${currency?.flag} ${$t(`Currency.Name.${currency?.code}`)}`"
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
            :label="`${currency?.flag} ${$t(`Currency.Name.${currency?.code}`)}`"
            @click="addCurrency(currency)"
          />
        </li>
      </TransitionGroup>
    </ul>
  </template>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useCurrenciesStore } from '@/store/currencies';
import { storeToRefs } from 'pinia';
import { useProfileStore } from '@/store/profile';
import type { Currency } from '@/types/currency';
import PillComponent from '@/components/PillComponent.vue';
import { ColorType } from '@/types/colors';
import { BIconPlus, BIconSearch, BIconX } from 'bootstrap-icons-vue';
import InputComponent from '@/components/InputComponent.vue';
import { useI18n } from 'vue-i18n';

function useAddCurrency(): (currency: Currency) => void {
  const profileStore = useProfileStore();
  const userCurrencies = profileStore.profile?.currencies;

  function addCurrency(currency: Currency): void {
    if (!profileStore.profile?.id) return;
    userCurrencies?.push(currency);
    userCurrencies?.sort((a, b) => {
      return a.id - b.id;
    });
    profileStore.updateProfile(
      {
        ...profileStore.profile,
        currencies: userCurrencies,
      },
    );
  }

  return addCurrency;
}

function useRemoveCurrency(): (id: number) => void {
  const profileStore = useProfileStore();
  const userCurrencies = profileStore.profile?.currencies;

  function removeCurrency(id: number): void {
    const index = userCurrencies?.findIndex((currency) => currency.id === id);
    if (!profileStore.profile?.id || index == undefined) return;
    userCurrencies?.splice(index, 1);
    profileStore.updateProfile(
      {
        ...profileStore.profile,
        currencies: userCurrencies,
      },
    );
  }

  return removeCurrency;
}

function matchCurrency(currency: Currency): boolean {
  const search = filter.value.toLowerCase().trim();
  if (!search) return true;

  const name = t(`Currency.Name.${currency.code}`).toLowerCase();
  const code = currency.code.toLowerCase();
  const num = currency.num;

  return name.includes(search) || code.includes(search) || num.includes(search);
}

const { t } = useI18n();

const currenciesStore = useCurrenciesStore();
const profileStore = useProfileStore();

const { pinnedCurrencies, unpinnedCurrencies } = storeToRefs(currenciesStore);
const { profile } = storeToRefs(profileStore);

const filter = ref('');

const defaultCurrency = computed(() => profile.value?.defaultCurrency);
const userCurrencies = computed(() => profile.value?.currencies?.filter((currency) => currency.id !== defaultCurrency.value?.id));
const addedCurrencies = computed(() => [defaultCurrency.value].concat(userCurrencies.value));

const otherPinnedCurrencies = computed(() => {
  return pinnedCurrencies.value
    .filter((currency) => !addedCurrencies.value?.some((addedCurrency) => addedCurrency?.id === currency.id))
    .filter(matchCurrency);
});

const otherUnpinnedCurrencies = computed(() => {
  return unpinnedCurrencies.value
    .filter((currency) => !addedCurrencies.value?.some((addedCurrency) => addedCurrency?.id === currency.id))
    .filter(matchCurrency);
});

const addCurrency = useAddCurrency();
const removeCurrency = useRemoveCurrency();

onBeforeMount(() => {
  const currenciesStore = useCurrenciesStore();
  currenciesStore.fetchCurrencies();
});
</script>

<style scoped lang="scss">
.currency__header {
  @apply mb-8;

  .currency__controls {
    @apply max-w-80;
    @apply grow shrink-0;
  }

  .currency__subtitle {
    @apply text-slate-500 dark:text-slate-400;
  }
}

.currencies-list {
  .list-enter-active,
  .list-leave-active {
    @apply scale-100;
    @apply transition-transform;
  }

  .list-enter-from,
  .list-leave-to {
    @apply scale-110;
  }
}

</style>