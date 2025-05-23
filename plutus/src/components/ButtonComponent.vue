<template>
  <div class="button-group">
    <button
      :type="type"
      :disabled="disabled"
      :class="[
        'button',
        `button--${color}`,
        { 'button--flex': flex },
        { 'button--outline': outline },
      ]"
    >
      <component :is="appendIcon" />
      {{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ColorType } from '@/types/colors';
import { ButtonType } from '@/types/controllers';
import type { Component } from 'vue';

interface Props {
  label?: string,
  color?: ColorType,
  flex?: boolean,
  outline?: boolean,
  type?: ButtonType,
  appendIcon?: Component,
  disabled?: boolean,
}

withDefaults(defineProps<Props>(), {
  color: ColorType.PRIMARY,
  type: ButtonType.BUTTON,
});
</script>

<style scoped lang="scss">
.button-group {
  .button {
    @apply py-1.5 px-4 flex gap-2 items-center;
    @apply text-slate-50;
    @apply rounded;

    &:disabled {
      @apply opacity-25;
      @apply cursor-not-allowed;
    }

    &:active {
      @apply translate-y-0.5;
    }

    &--primary {
      @apply  bg-blue-500 dark:bg-blue-600;
    }

    &--secondary {
      @apply bg-slate-500 dark:bg-slate-600;
    }

    &--danger {
      @apply bg-red-600 dark:bg-red-800;
    }

    &--flex {
      @apply w-full justify-center;
    }

    &--outline {
      @apply bg-opacity-0;
    }

    svg {
      @apply h-5 w-5;
    }
  }
}
</style>
