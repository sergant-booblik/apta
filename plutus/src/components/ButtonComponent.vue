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

<script lang="ts">
import { defineComponent } from 'vue';
import { Colors } from '@/types/colors';
import { Button } from '@/types/controllers';
import type { PropType } from 'vue';
import type { ColorType } from '@/types/colors';
import type { ButtonType } from '@/types/controllers';

const ButtonComponent = defineComponent({
  props: {
    label: {
      type: String,
      default: undefined,
    },
    color: {
      type: String as PropType<ColorType>,
      default: Colors.PRIMARY,
    },
    flex: {
      type: Boolean,
      default: false,
    },
    outline: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<ButtonType>,
      default: Button.BUTTON,
    }
  },
});
export default ButtonComponent;
</script>
