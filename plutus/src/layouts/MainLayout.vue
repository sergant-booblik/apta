<template>
  <div :class="{ 'main-layout--overlay': isOverlay }">
    <HeaderComponent />
    <SubheaderComponent />
    <div class="body">
      <RouterView />
    </div>
    <SidePanelComponent v-if="isSidePanelOpen" />
    <ModalComponent
      ref="modalComponentRef"
      v-if="isModalOpen"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useSidePanelStore } from '@/store/side-panel';
import HeaderComponent from '@/components/HeaderComponent.vue';
import SubheaderComponent from '@/components/SubheaderComponent.vue';
import SidePanelComponent from '@/components/SidePanelComponent.vue';
import ModalComponent from "@/components/ModalComponent.vue";
import {useModalStore} from "@/store/modal";

const sidePanelStore = useSidePanelStore();
const modalStore = useModalStore();

const modalComponentRef = ref<HTMLElement>();

const isSidePanelOpen = computed(() => sidePanelStore.type !== undefined);
const isModalOpen = computed(() => modalStore.type !== undefined);

const isOverlay = computed(() => isSidePanelOpen.value || isModalOpen.value);
</script>
