<template>
  <div class="body__header">
    <h1>{{ t('Expenses') }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n();
</script>
