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

<script setup lang="ts">
import { toRefs } from 'vue'
import { computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { InputType } from '@/types/controllers'

interface Props {
  modelValue?: string,
  label?: string,
  placeholder?: string,
  type?: InputType,
}

const props = withDefaults(defineProps<Props>(), {
  type: InputType.TEXT,
});

const emit = defineEmits(['update:modelValue', 'input', 'blur']);

const { modelValue } = toRefs(props);

const inputValue = computed({
  get: () => modelValue.value,
  set: (value) => emit('update:modelValue', value),
});

const debouncedInput = useDebounceFn(() => {
  emit('input');
}, 1000);
</script>
