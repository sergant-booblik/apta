<template>
  <div
    :class="[
      'pill',
      `pill--${color}`,
      { 'pill--outline': outline },
      { 'pill--disabled': disabled },
    ]"
    @mouseenter="isShowControl = true"
    @mouseleave="isShowControl = false"
  >
    <div class="pill__text">
      {{ label }}
    </div>
    <div
      v-if="isShowControl && control?.icon"
      class="pill__control"
      :class="`pill__control--${control?.color}`"
    >
      <component :is="control?.icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component, ref } from 'vue';
import { ColorType } from '@/types/colors';

interface Props {
  label?: string,
  control?: { color: ColorType, icon: Component },
  color?: ColorType,
  outline?: boolean,
  disabled?: boolean,
}

withDefaults(defineProps<Props>(), {
  color: ColorType.PRIMARY,
});

const isShowControl = ref(false);
</script>

<style scoped lang="scss">
.pill {
  @apply relative;
  @apply py-1 px-2.5;
  @apply border;
  @apply rounded-full;

  @include use-component-color(true);

  &--disabled {
    @apply opacity-85;
    @include use-component-color(false);
  }

  .pill__control {
    @apply absolute -top-1 -right-1;
    @apply py-0.5 px-1;
    @apply rounded-full;

    @include use-component-color(false);

    &:hover {
      @apply scale-110;
    }

    svg	{
      @apply w-3 h-3;
    }
  }
}
</style>