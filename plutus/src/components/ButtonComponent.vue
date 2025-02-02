<template>
  <div class="button-group">
    <button
      :type="type"
      :class="[
        'button',
        `button--${color}`,
        { 'button--flex': flex },
        { 'button--outline': outline },
      ]"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ColorType } from '@/types/colors'
import { ButtonType } from '@/types/controllers'

interface Props {
  label?: string,
  color?: ColorType,
  flex?: boolean,
  outline?: boolean,
  type?: ButtonType,
}

withDefaults(defineProps<Props>(), {
  color: ColorType.PRIMARY,
  type: ButtonType.BUTTON,
});
</script>
