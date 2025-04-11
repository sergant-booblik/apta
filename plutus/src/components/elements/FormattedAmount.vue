<template>
  <span
    :class="[
      'format',
      getContrastAmountClass(backgroundColor, calculateSign(sum)),
    ]"
  >
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
import { Sign } from '@/types/currency'
import { getContrastAmountClass } from '@/helpers/contrast-amount-class'
import Icon from '@/components/icons'

function useCalculateSign(sign: Sign | undefined): (amount: number | undefined) => Sign {
  function calculateSign(amount: number | undefined): Sign {
    if (sign !== undefined && sign !== Sign.NONE) return sign;
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
  backgroundColor?: string,
}

const props = defineProps<Props>();

const { sign, sum } = toRefs(props);

const calculateSign = useCalculateSign(sign.value);

const signComponent = computed(() => {
  switch (calculateSign(sum.value)) {
    case Sign.NEUTRAL:
      return Icon.Dot;
    case Sign.POSITIVE:
      return Icon.CaretUp;
    case Sign.NEGATIVE:
      return Icon.CaretDown;
    default:
      return Sign.NEUTRAL;
  }
});
</script>
