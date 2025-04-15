<template>
  <span
    :class="[
      'loader',
      `loader--${size}`,
    ]"
  />
</template>

<script setup lang="ts">
import { LoaderSize } from '@/types/loader';

interface Props {
  size?: LoaderSize,
}

withDefaults(defineProps<Props>(), {
  size: LoaderSize.SMALL,
});
</script>

<style scoped lang="scss">
.loader {
  @apply inline-block;
  @apply rounded-full;
  @apply border-t-2 border-t-slate-600 dark:border-t-slate-500;
  @apply border-inherit;
  @apply border-r-2 border-r-transparent;
  @apply animate-spin;

  &--sm {
    @apply w-6 h-6;
  }

  &--md {
    @apply w-12 h-12;
  }

  &--lg {
    @apply w-24 h-24;
  }
}
</style>