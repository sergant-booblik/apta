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
import { computed } from 'vue'

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

<style lang="scss" src="src/scss/components/controls/toggle.scss" />