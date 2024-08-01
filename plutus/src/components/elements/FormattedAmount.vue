<template>
  <span :class="[
    'format',
    `format--${calculateSign(sum)}`,
  ]">
    <component
      :is="`sign-${calculateSign(sum)}-icon`"
    />
    {{ toMoney(sum, currencyCode) }}
  </span>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { toMoney } from '@/helpers/to-money';
import FormattedAmountIcon from '@/components/icons/amount-format';

export enum Sign {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
}

function useCalculateSign(sign: Sign | undefined): (amount: number) => Sign {
  function calculateSign(amount: number): Sign {
    if (sign !== undefined) return sign;
    if (amount > 0) return Sign.POSITIVE;
    if (amount < 0) return Sign.NEGATIVE;
    return Sign.NEUTRAL;
  }

  return calculateSign;
}

const FormattedAmount = defineComponent({
  components: {
    ...FormattedAmountIcon,
  },
  props: {
    sum: {
      required: true,
      type: Number,
    },
    currencyCode: {
      required: true,
      type: String,
    },
    sign: {
      required: false,
      type: String as PropType<Sign>,
      default: undefined,
    },
  },
  setup(props) {
    const calculateSign = useCalculateSign(props.sign);

    return {
      toMoney,
      calculateSign,
    };
  },
});

export default FormattedAmount;
</script>
