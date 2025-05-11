<template>
  <div class="subheader">
    <div class="subheader-inner">
      <div class="subheader-menu">
        <div class="subheader-menu-item">
          <router-link
            :to="{ name: RouteName.BILLS }"
            exact
            exact-active-class="subheader-menu-item-link--active"
            class="subheader-menu-item-link"
          >
            <component :is="BIconWallet2" />
            {{ t(`Header.Subheader.Menu.accounts`) }}
          </router-link>
        </div>
        <div class="subheader-menu-item">
          <router-link
            :to="{ name: RouteName.EXPENSES }"
            exact
            exact-active-class="subheader-menu-item-link--active"
            class="subheader-menu-item-link"
          >
            <component :is="Icon.Expenses" />
            {{ t(`Header.Subheader.Menu.expenses`) }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RouteName } from '@/router';
import { BIconWallet2 } from 'bootstrap-icons-vue';
import Icon from './icons';

const { t } = useI18n();
</script>

<style scoped lang="scss">
.subheader {
  @apply  bg-slate-300 dark:bg-slate-800;

  .subheader-inner {
    @apply px-6 py-3.5 flex justify-center items-center;

    .subheader-menu {
      @apply flex gap-8;

      .subheader-menu-item-link {
        @apply flex items-center gap-2;
        @apply text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-400;
        @apply no-underline;

        &--active {
          @apply text-slate-800 dark:text-slate-200;
        }
      }
    }
  }
}
</style>