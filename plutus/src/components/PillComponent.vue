<template>
  <div
    :class="[
      'pill',
      `pill--${color}`,
      { 'pill--outline': outline },
      { 'pill--disabled': disabled },
    ]"
    @mouseenter="isShowControl = true"
    @mouseleave="isShowControl = false"
  >
    <div class="pill__text">
      {{ label }}
    </div>
    <div
      v-if="isShowControl && control?.icon"
      class="pill__control"
      :class="`pill__control--${control?.color}`"
    >
      <component :is="control?.icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component, ref } from 'vue'
import { ColorType } from '@/types/colors'

interface Props {
  label?: string,
  control?: { color: ColorType, icon: Component },
  color?: ColorType,
  outline?: boolean,
  disabled?: boolean,
}

withDefaults(defineProps<Props>(), {
  color: ColorType.PRIMARY,
});

const isShowControl = ref(false);
</script>
