<template>
  <div class="card">
    <slot />
  </div>
</template>

<script setup lang="ts" />

<style lang="scss">
.card {
  @apply p-5 border border-slate-300 dark:border-slate-700 rounded-xl;
  @apply bg-slate-200 dark:bg-slate-800;

  &:hover {
    @apply bg-slate-300 dark:bg-slate-700;
    @apply -translate-y-1;
    transition: background-color 300ms ease, transform 300ms ease;
  }
}

</style>
