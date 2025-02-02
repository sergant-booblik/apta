<template>
  <component
    :is="layoutName"
    :class="layoutName"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import EmptyLayout from '@/layouts/EmptyLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';

const App = defineComponent({
  components: {
    EmptyLayout,
    MainLayout,
  },
  beforeMount() {
    if (localStorage.theme === undefined) {
      localStorage.theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    const htmlElement = document.querySelector('html');
    htmlElement?.setAttribute('data-mode', localStorage.theme);
  },
  setup() {
    const colorTheme = computed(() => localStorage.theme);

    const route = useRoute();
    const layout = computed(() => route.meta.layout);
    const layoutName = computed(() => `${layout.value}-layout`);

    return {
      layoutName,
      colorTheme,
    };
  },
});

export default App;
</script>

<style lang="scss" src="@/scss/style.scss" />
