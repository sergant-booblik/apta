<template>
  <span :class="[
    'format',
    `format--${calculateSign(sum)}`,
  ]">
    <component
      v-if="sign !== Sign.NONE"
      :is="signComponent"
    />
    {{ toMoney(sum, currencyCode) }}
  </span>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { toMoney } from '@/helpers/to-money'
import FormattedAmountIcon from '@/components/icons/amount-format'
import { Sign } from '@/types/currency'

function useCalculateSign(sign: Sign | undefined): (amount: number | undefined) => Sign {
  function calculateSign(amount: number | undefined): Sign {
    if (sign !== undefined) return sign;
    if (amount) {
      if (amount > 0) return Sign.POSITIVE;
      if (amount < 0) return Sign.NEGATIVE;
    }
    return Sign.NEUTRAL;
  }

  return calculateSign;
}

interface Props {
  sum?: number,
  currencyCode?: string,
  sign?: Sign,
}

const props = defineProps<Props>();

const { sign, sum } = toRefs(props);

const calculateSign = useCalculateSign(sign.value);

const signComponent = computed(() => {
  switch (calculateSign(sum.value)) {
    case Sign.NEUTRAL:
      return FormattedAmountIcon.SignNeutralIcon;
    case Sign.POSITIVE:
      return FormattedAmountIcon.SignPositiveIcon;
    case Sign.NEGATIVE:
      return FormattedAmountIcon.SignNegativeIcon;
    default:
      return Sign.NEUTRAL;
  }
});
</script>
