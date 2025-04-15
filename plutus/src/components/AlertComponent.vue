<template>
  <div class="alert">
    <div class="alert__icon">
      <component :is="icon" />
    </div>
    <div
      class="alert__text"
      v-text="text"
    />
    <div class="alert__controls">
      <div
        v-for="control in controls"
        v-text="control.label"
        :class="[
          'alert__control',
          `alert__control--${control.color}`,
        ]"
        @click="control.onClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { AlertControl } from '@/types/controllers'

interface Props {
  icon: Component,
  text: string,
  controls: AlertControl[],
}

defineProps<Props>();
</script>

<style scoped lang="scss">
.alert {
  @apply flex items-center gap-4;
  @apply px-4 py-3;
  @apply border border-slate-700 dark:border-slate-300;
  @apply rounded-md;

  .alert__icon {
    svg {
      @apply w-6 h-6;
    }
  }

  .alert__text {
    @apply whitespace-pre-line;
  }

  .alert__controls {
    @apply ms-auto;
    @apply flex gap-3;
  }

  .alert__control {
    @apply border-b;
    @apply cursor-pointer;

    &:hover {
      @apply opacity-80;
    }

    &--primary {
      @apply text-blue-500 dark:text-blue-600;
      @apply border-blue-500 dark:border-blue-600;
    }

    &--secondary {
      @apply text-slate-400 dark:text-slate-600;
      @apply border-slate-300 dark:border-slate-600;
    }

    &--danger {
      @apply text-red-600 dark:text-red-400;
      @apply border-red-600 dark:border-red-400;
    }
  }
}
</style>