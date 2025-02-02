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

<script setup lang="ts">
import { ColorType } from '@/types/colors'

interface Props {
  label?: string,
  color?: ColorType,
  outline?: boolean,
}

withDefaults(defineProps<Props>(), {
  color: ColorType.PRIMARY,
});
</script>
