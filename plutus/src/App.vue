<template>
  <component
    :is="layoutName"
    :class="layoutName"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router';
import EmptyLayout from '@/layouts/EmptyLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { Layout } from '@/router'

const route = useRoute();
const layout = computed(() => route.meta.layout);
const layoutName = computed(() => {
  switch(layout.value) {
    case Layout.EMPTY:
      return EmptyLayout;
    case Layout.MAIN:
      return MainLayout;
    default:
      return EmptyLayout;
  }
});

onBeforeMount(() => {
  if (localStorage.theme === undefined) {
    localStorage.theme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  const htmlElement = document.querySelector('html');
  htmlElement?.setAttribute('data-mode', localStorage.theme);
});
</script>

<style lang="scss" src="scss/style.scss" />
