<template>
  <div class="button-group">
    <button
      type="button"
      class="button button--secondary button--flex flex gap-2 items-center h-10"
      @click="openColorPicker"
    >
      <span
        class="w-5 h-5 rounded-full ms-1"
        :style="{ backgroundColor: localValue ?? '#FFFFFF' }"
      />
      <span class="me-1">
        {{ label }}
      </span>
    </button>
    <div
      ref="colorPickerRef"
      v-if="isColorPickerOpened"
      class="absolute bottom-0 translate-x-20"
    >
        <ColorPicker
          v-model:pure-color="localValue"
          :isWidget="true"
          format="hex"
          shape="circle"
          :picker-container="container"
          :zIndex="10"
          disable-alpha
          disable-history
        />
      </div>
  </div>
</template>

<script setup lang="ts">
import { ColorPicker } from 'vue3-colorpicker';
import "vue3-colorpicker/style.css";
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

interface Props {
  modelValue: string,
  label?: string,
  container?: string,
}

const props = defineProps<Props>();

const emit = defineEmits(['update']);

const colorPickerRef = ref<HTMLElement>();
const isColorPickerOpened = ref(false);

const openColorPicker = () => {
  isColorPickerOpened.value = true;
};

const closeColorPicker = () => {
  isColorPickerOpened.value = false;
};

const localValue = computed({
  get: () => props.modelValue,
  set: (v) => {
    emit('update', v);
    return v;
  },
});

onClickOutside(colorPickerRef, () => {
  closeColorPicker();
});
</script>

<style lang="scss">

</style>