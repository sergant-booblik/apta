<template>
  <div class="input-group">
    <label
      v-if="label"
      class="me-2"
    >
      {{ label }}
    </label>
    <input
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      class="w-full"
      @input="debouncedInput"
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { Input } from '@/types/controllers';
import type { PropType } from 'vue';
import type { InputType } from '@/types/controllers';

const InputComponent = defineComponent({
  props: {
    modelValue: {
      type: String,
      default: undefined,
    },
    label: {
      type: String,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: undefined,
    },
    type: {
      type: String as PropType<InputType>,
      default: Input.TEXT,
    },
  },
  emits: ['update:modelValue', 'input', 'blur'],
  setup(props, {emit}) {
    const inputValue = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    const debouncedInput = useDebounceFn(() => {
      emit('input');
    }, 1000);

    return {
      inputValue,
      debouncedInput,
    };
  },
});
export default InputComponent;
</script>
