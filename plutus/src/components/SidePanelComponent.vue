<template>
  <div
    ref="sidePanelRef"
    class="side-panel"
  >
    <BIconXLg
      role="button"
      class="side-panel__close"
      @click="closeSidePanel()"
    />
    <component
      :is="SidePanelComponent"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useSidePanelStore } from '@/store/side-panel'
import { BIconXLg } from 'bootstrap-icons-vue';
import { SidePanelType } from '@/types/side-panel'
import SidePanel from '@/components/side-panel'

function closeSidePanel(): void {
  const sidePanelStore = useSidePanelStore();
  sidePanelStore.removeSidePanel();
}

const sidePanelStore = useSidePanelStore();
const { type } = storeToRefs(sidePanelStore);

const sidePanelRef = ref<HTMLElement>();

const SidePanelComponent = computed(() => {
  switch (type.value) {
    case SidePanelType.CURRENCIES:
      return SidePanel.CurrenciesComponent;
    default:
      throw new Error(`Unrecognized ${type.value} side panel type`);
  }
});

onClickOutside(sidePanelRef, () => sidePanelStore.removeSidePanel());
</script>

<style scoped lang="scss">
.side-panel {
  @apply bg-slate-800;
  @apply absolute h-full top-0 right-0 min-w-80 max-w-[calc(100%-20rem)] z-20;
  @apply py-8 ps-6 pe-10;
  @apply overflow-scroll;

  animation: appear 300ms;
}

.side-panel__close {
  position: absolute;
  @apply m-3;
  @apply top-0 right-0;
}

@keyframes appear {
  0% {
    @apply -right-80;
  }
  100% {
    @apply right-0;
  }
}
</style>