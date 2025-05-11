<template>
  <label class="toggle">
    <input
      v-model="localValue"
      :checked="localValue"
      type="checkbox"
    />
    <span class="slider" />
    <span class="label">
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: boolean,
  label?: string,
}

const props = defineProps<Props>();

const emit = defineEmits(['update:modelValue']);

const localValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});
</script>

<style scoped lang="scss">
.toggle {
  @apply inline-flex items-center gap-2;
  @apply cursor-pointer;

  input {
    @apply hidden;

    &:checked + .slider {
      @apply bg-blue-500 dark:bg-blue-600;

      &:before {
        @apply translate-x-3;
      }
    }
  }

  .slider {
    @apply relative;
    @apply w-9 h-6;
    @apply bg-slate-600 dark:bg-slate-400 rounded-xl;
    @apply transition-colors;

    &::before {
      @apply content-[""];
      @apply absolute left-1 top-1;
      @apply w-4 h-4;
      @apply bg-slate-50;
      @apply rounded-full;
      @apply transition-transform;
    }
  }

  .toggle-text {
    @apply text-white;
  }
}
</style>