<template>
  <div
    ref="dropdownRef"
    :class="[
      'dropdown',
      `dropdown--${float}`,
    ]"
    @click="toggleDropdown"
  >
    <slot
      name="button"
      class="w-full"
    />
    <div
      v-if="isDropdownOpen"
      class="dropdown__inner"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

interface Props {
  float: 'start' | 'end';
}

function openDropdown(): void {
  isDropdownOpen.value = true;
}

function closeDropdown(): void {
  isDropdownOpen.value = false;
}

function toggleDropdown(): void {
  if (isDropdownOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

withDefaults(defineProps<Props>(), {
  float: 'start',
});

const dropdownRef = ref<HTMLElement>();

const isDropdownOpen = ref(false);

onClickOutside(dropdownRef, () => {
  closeDropdown();
});
</script>
<style scoped lang="scss" src="src/scss/components/dropdown.scss" />
