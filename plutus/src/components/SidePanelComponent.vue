<template>
  <div
    ref="sidePanelRef"
    class="side-panel"
  >
    <Icon.CloseIcon
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
import Icon from '@/components/icons'
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
