<template>
  <h2>!List of currencies!</h2>
  <h3>!Added currencies!</h3>
  <ul class="mt-3 flex flex-wrap currencies-list">
    <TransitionGroup name="list">
      <li
        v-for="currency in userCurrencies"
        :key="currency.id"
        class="mb-2 mr-2"
      >
        <PillComponent
          outline
          role="button"
          :label="`${currency.code} ${currency.flag}`"
          @click="removeCurrency(currency.id)"
        />
      </li>
    </TransitionGroup>
  </ul>
  <h3>!New currencies!</h3>
  <ul class="mt-3 flex flex-wrap currencies-list">
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
          @click="addCurrency(currency)"
        />
      </li>
    </TransitionGroup>
  </ul>
  <h3>!More currencies!</h3>
  <ul class="mt-3 flex flex-wrap currencies-list">
    <TransitionGroup name="list">
      <li
        v-for="currency in otherUnpinnedCurrencies"
        :key="currency.id"
        class="mb-2 mr-2"
      >
        <PillComponent
          outline
          role="button"
          :label="`${currency.code} ${currency.flag}`"
          @click="addCurrency(currency)"
        />
      </li>
    </TransitionGroup>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useCurrenciesStore } from "@/store/currencies";
import { storeToRefs} from "pinia";
import { useUserStore } from '@/store/user';
import type { Currency } from '@/types/currency';
import inter from "../../helpers/translation";
import ButtonComponent from "@/components/ButtonComponent.vue";
import PillComponent from "@/components/PillComponent.vue";

function useAddCurrency(): (currency: Currency) => void {
  const userStore = useUserStore();
  const userCurrencies = userStore.settings?.currencies;

  function addCurrency(currency: Currency) {
    userCurrencies?.push(currency);
    userCurrencies?.sort((a, b) => {
      return a.id - b.id;
    });
    userStore.updateSettings(
      userStore.profile.id,
      {
        ...userStore.settings,
        currencies: userCurrencies,
      }
    );
  }

  return addCurrency;
}

function useRemoveCurrency(): (id: number) => void {
  const userStore = useUserStore();
  const userCurrencies = userStore.settings.currencies;
  function removeCurrency(id: number) {
    const index = userCurrencies.findIndex((currency) => currency.id === id);
    userCurrencies.splice(index, 1);
    userStore.updateSettings(
      userStore.profile.id,
      {
        ...userStore.settings,
        currencies: userCurrencies,
      }
    );
  }

  return removeCurrency;
}

const CurrenciesComponent = defineComponent({
  components: {PillComponent, ButtonComponent},
  beforeMount() {
    const currenciesStore = useCurrenciesStore();
    currenciesStore.fetchPinnedCurrencies();
    currenciesStore.fetchUnpinnedCurrencies();
  },
  setup() {
    const currenciesStore = useCurrenciesStore();
    const userStore = useUserStore();

    const { pinnedCurrencies, unpinnedCurrencies } = storeToRefs(currenciesStore);
    const { settings } = storeToRefs(userStore);

    const userCurrencies = computed(() => settings.value?.currencies);

    const otherPinnedCurrencies = computed(() => {
      return pinnedCurrencies.value.filter((currency) => !userCurrencies.value?.some((userCurrency) => userCurrency.id === currency.id));
    });

    const otherUnpinnedCurrencies = computed(() => {
      return unpinnedCurrencies.value.filter((currency) => !userCurrencies.value?.some((userCurrency) => userCurrency.id === currency.id));
    });

    const addCurrency = useAddCurrency();
    const removeCurrency = useRemoveCurrency();

    return {
      inter,
      otherPinnedCurrencies,
      otherUnpinnedCurrencies,
      userCurrencies,
      addCurrency,
      removeCurrency,
    };
  },
});

export default CurrenciesComponent;
</script>
