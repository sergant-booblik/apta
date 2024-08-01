<template>
  <div
    :class="[
      'pill',
      `pill--${color}`,
      { 'pill--outline': outline },
    ]"
  >
    {{ label }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Colors } from '@/types/colors';
import type { PropType } from 'vue';
import type { ColorType } from '@/types/colors';

const PillComponent = defineComponent({
  props: {
    label: {
      type: String,
      default: undefined,
    },
    color: {
      type: String as PropType<ColorType>,
      default: Colors.PRIMARY,
    },
    outline: {
      type: Boolean,
      default: false,
    },
  },
});

export default PillComponent;
</script>
