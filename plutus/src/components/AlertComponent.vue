<template>
  <div class="alert">
    <div class="alert__icon">
      <component :is="icon" />
    </div>
    <div
      class="alert__text"
      v-text="text"
    />
    <div class="alert__controls">
      <div
        v-for="control in controls"
        v-text="control.label"
        :class="[
          'alert__control',
          `alert__control--${control.color}`,
        ]"
        @click="control.onClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { AlertControl } from '@/types/controllers'

interface Props {
  icon: Component,
  text: string,
  controls: AlertControl[],
}

defineProps<Props>();
</script>

<style scoped lang="scss">

</style>