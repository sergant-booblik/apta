<template>
  <div
    :class="[
      'input-group',
      { 'input-group--flex': flex }
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
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { InputType } from '@/types/controllers'

interface Props {
  modelValue?: string | number,
  label?: string,
  placeholder?: string,
  type?: InputType,
  flex?: boolean,
  toFixed?: boolean,
  prependText?: string,
  appendText?: string,
  disabled?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  type: InputType.TEXT,
});

const emit = defineEmits(['update:modelValue', 'input', 'blur']);

const { modelValue, toFixed } = toRefs(props);

const inputValue = computed({
  get: () => toFixed && typeof modelValue.value === 'number' ? modelValue.value.toFixed(2) : modelValue.value,
  set: (value) => emit('update:modelValue', value),
});

const debouncedInput = useDebounceFn(() => {
  emit('input');
}, 1000);
</script>
