<template>
  <div class="select-wrapper">
    <div
      :class="[
      'select-group',
      { 'select-group--flex': flex },
      { 'select-group--disabled': disabled },
      { 'select-group--invalid': errors },
    ]"
    >
      <label
        v-if="label"
        class="me-2"
      >
        {{ label }}
      </label>
      <select
        v-model="selectValue"
        :disabled="disabled"
      >
        <option
          v-if="placeholder && modelValue === undefined"
          :value="undefined"
          selected
          disabled
        >
          {{ placeholder }}
        </option>
        <option
          v-for="choice in choices"
          :key="choice.key"
          :value="choice.key"
        >
          {{ choice.value }}
        </option>
      </select>
    </div>
    <div
      v-if="errors"
      class="mb-3 flex justify-end"
    >
      <span
        v-for="(error, index) in errors"
        :key="index"
        class="text-xs error "
      >
        {{ t(error.label) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Choice } from '@/types/choice';
import { computed, toRefs } from 'vue';
import type { ErrorDetail } from '@/types/error';
import { useI18n } from 'vue-i18n';

interface Props {
  modelValue: unknown,
  placeholder?: string,
  label?: string,
  flex?: boolean,
  disabled?: boolean,
  choices: Choice[],
  errors?: ErrorDetail[],
}

const props = withDefaults(defineProps<Props>(), {
  flex: false,
  disabled: false,
});

const emit = defineEmits(['update:modelValue', 'change']);

const { t } = useI18n();

const { modelValue } = toRefs(props);

const selectValue = computed({
  get: () => modelValue.value,
  set: (v) => {
    emit('update:modelValue', v);
    emit('change');
  },
});
</script>

<style scoped lang="scss">
.select-wrapper:has(.select-group--flex) {
  @apply w-full;
}

.select-group {
  @apply flex flex-col;

  select {
    @apply px-2 py-1;
    @apply h-9;
    @apply bg-slate-100 dark:bg-slate-900;
    @apply border rounded border-slate-300 dark:border-slate-700;
    @apply text-slate-950 dark:text-slate-50;

    &:has(option:disabled) {
      @apply text-opacity-50;
    }
  }

  &--flex {
    @apply flex-row items-baseline;
    @apply w-full;

    label {
      @apply mr-2;
      @apply grow shrink-0;
    }

    select {
      @apply w-full;
    }
  }

  &--disabled {
    @apply opacity-50;
  }

  &--invalid {
    select {
      @apply border-red-600 dark:border-red-400;
    }

    label {
      @apply text-red-600 dark:text-red-400;
    }
  }
}

.error {
  @apply text-red-600 dark:text-red-400;
}
</style>

