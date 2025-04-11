<template>
  <div>
    <div
      :class="[
      'input-group',
      { 'input-group--flex': flex },
      { 'input-group--invalid': errors?.length || invalid },
    ]"
    >
      <label
        v-if="label"
        class="me-2"
      >
        {{ label }}
      </label>
      <div
        v-if="prependText"
        class="input-text input-text--append"
      >
        {{ prependText }}
      </div>
      <input
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full"
        @input="debouncedInput"
      >
      <div
        v-if="appendText"
        class="input-text input-text--append"
      >
        {{ appendText }}
      </div>
    </div>
    <div
      v-if="errors"
      class="mb-3 flex flex-col justify-end"
    >
      <span
        v-for="(error, index) in errors"
        :key="index"
        class="text-xs text-red-400"
      >
        {{ t(error.label) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { InputType } from '@/types/controllers'
import type { ErrorDetail } from '@/types/error'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue?: string | number | Date,
  label?: string,
  placeholder?: string,
  type?: InputType,
  flex?: boolean,
  toFixed?: boolean,
  prependText?: string,
  appendText?: string,
  disabled?: boolean,
  errors?: ErrorDetail[],
  invalid?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  type: InputType.TEXT,
});

const emit = defineEmits(['update:modelValue', 'input', 'blur']);

const { t } = useI18n();

const { modelValue, toFixed } = toRefs(props);

const inputValue = computed({
  get: () => modelValue.value,
  set: (value) => emit('update:modelValue', value),
});

const debouncedInput = useDebounceFn(() => {
  emit('input');
}, 1000);
</script>

<style scoped lang="scss">
.input-group {
  &:has(input:disabled) {
    @apply opacity-40;

    input {
      @apply cursor-not-allowed;
    }
  }

  &:has(.input-text--append) {
    input {
      @apply rounded-e-none;
    }
  }

  input {
    @apply px-2 py-1;
    @apply h-9;
    @apply bg-slate-900;
    @apply border rounded border-slate-700;

    &::-webkit-calendar-picker-indicator {
      @apply invert;
    }
  }

  &--flex {
    @apply flex items-baseline;
    @apply w-full;

    label {
      @apply mr-2;
      @apply grow shrink-0;
    }
  }

  &--invalid {
    label {
      @apply text-red-400;
    }

    input {
      @apply border-red-400;
    }
  }

  .input-text {
    @apply px-2 py-1;
    @apply bg-slate-700 border border-slate-700;

    &--append {
      @apply relative;
      @apply -top-px;
      @apply h-9;
      @apply rounded-e;
    }
  }
}

</style>