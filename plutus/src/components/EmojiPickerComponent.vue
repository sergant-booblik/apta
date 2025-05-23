<template>
  <div
    ref="emojiPickerRef"
    class="emoji-picker"
  >
    <EmojiPicker
      v-if="isShowEmojiPicker"
      native
      hide-group-names
      :text="localEmoji"
      :static-texts="{ placeholder: t('EmojiPicker.placeholder')}"
      :theme="theme"
      class="absolute bottom-0 left-full"
      @select="selectEmoji"
    />
    <ButtonComponent
      :color="ColorType.SECONDARY"
      :label="localEmoji"
      @click="toggleEmojiPicker"
    />
  </div>
</template>

<script setup lang="ts">
import { ColorType } from '@/types/colors';
import ButtonComponent from '@/components/ButtonComponent.vue';
import { computed, ref } from 'vue';
import EmojiPicker, { type EmojiExt } from 'vue3-emoji-picker';
import { onClickOutside } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import 'vue3-emoji-picker/css';
import type { Theme } from '@/types/profile';

function closeEmojiPicker(): void {
  isShowEmojiPicker.value = false;
}

function openEmojiPicker(): void {
  isShowEmojiPicker.value = true;
}

function toggleEmojiPicker(): void {
  if (isShowEmojiPicker.value) {
    closeEmojiPicker();
  } else {
    openEmojiPicker();
  }
}

function selectEmoji(emoji: EmojiExt): void {
  localEmoji.value = emoji.i;
  closeEmojiPicker();
}

interface Props {
  modelValue?: string,
}

const props = defineProps<Props>();

const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();

const localEmoji = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const emojiPickerRef = ref<HTMLElement>();

const isShowEmojiPicker = ref(false);

const theme = localStorage.getItem('theme') as Theme;

onClickOutside(emojiPickerRef, () => closeEmojiPicker());
</script>

<style scoped lang="scss">
.emoji-picker {
  @apply z-10;
  @apply relative;

  .v3-emoji-picker.v3-color-theme-dark {
    @apply bg-slate-300 dark:bg-slate-700;
    @apply text-slate-900 dark:text-slate-100;
  }

  :deep(.v3-emoji-picker .v3-search input)  {
    @apply bg-slate-100 dark:bg-slate-600;
  }

  :deep(.v3-emoji-picker .v3-footer) {
    @apply hidden;
  }
}
</style>