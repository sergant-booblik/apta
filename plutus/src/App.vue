<template>
  <component
    :is="layoutName"
    :class="layoutName"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import EmptyLayout from '@/layouts/EmptyLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { Layout } from '@/router';
import { useTheme } from '@/composable/useTheme';

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

useTheme();
</script>

<style lang="scss" src="scss/style.scss" />
