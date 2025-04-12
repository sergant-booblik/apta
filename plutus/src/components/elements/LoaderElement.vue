<template>
  <span class="loader" />
</template>

<script setup lang="ts" />

<style scoped lang="scss">
.loader {
  @apply inline-block;
  @apply w-5 h-5;
  @apply rounded-full;
  @apply border-t-2 border-t-slate-500;
  @apply border-r-2 border-r-transparent;
  @apply animate-spin;
}
</style>