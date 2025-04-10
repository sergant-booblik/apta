<template>
  <h1>{{ $t('SETTINGS') }}</h1>
  <a
    role="button"
    @click="openSideMenu(SidePanelType.CURRENCIES)"
  >
    !Currencies!
  </a>
</template>

<script setup lang="ts">
import { useSidePanelStore } from '@/store/side-panel';
import { SidePanelType } from "@/types/side-panel";

function openSideMenu(type: SidePanelType): void {
  const sidePanelStore = useSidePanelStore();
  sidePanelStore.setSidePanel(type);
}
</script>
