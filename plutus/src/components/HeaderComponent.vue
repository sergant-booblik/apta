<template>
  <div class="header">
    <div class="header-inner">
      <router-link
        :to="{ name: RouteName.HOME }"
        class="header-title"
      >
        <Icon.LogoIcon />
        <h1>Pluton</h1>
      </router-link>
      <DropdownComponent
        v-if="authStore.isAuth"
        float="end"
      >
        <template #button>
          <div
            role="button"
            class="settings-button"
          >
            <BIconThreeDotsVertical />
          </div>
        </template>
        <template #content>
          <div class="settings-menu">
            <div class="settings-menu__inner">
              <router-link
                :to="{ name: RouteName.PROFILE }"
                class="menu-item"
              >
                <div class="menu-item__icon">
                  <BIconPersonCircle />
                </div>
                <div class="menu-item__text">
                  {{ $t('Header.Settings.Menu.profile') }}
                </div>
              </router-link>
              <router-link
                :to="{ name: RouteName.SETTINGS }"
                class="menu-item"
              >
                <div class="menu-item__icon">
                  <BIconGear />
                </div>
                <div class="menu-item__text">
                  {{ $t('Header.Settings.Menu.account-settings') }}
                </div>
              </router-link>
              <div
                class="menu-item"
                @click="toggleTheme"
              >
                <div class="menu-item__icon">
                  <BIconSun v-if="profile?.theme === 'light'" />
                  <BIconMoon v-else />
                </div>
                <div class="menu-item__text">
                  {{ $t('Header.Settings.Menu.color-theme') }}
                </div>
              </div>
              <div
                class="menu-item"
                @click="authStore.logout(router)"
              >
                <div class="menu-item__icon">
                  <BIconDoorOpen />
                </div>
                <div class="menu-item__text">
                  {{ $t('Header.Settings.Menu.logout') }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </DropdownComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/icons';
import DropdownComponent from '@/components/DropdownComponent.vue';
import router, { RouteName } from '@/router';
import { useAuthStore } from '@/store/auth';
import {
  BIconThreeDotsVertical, BIconDoorOpen, BIconGear, BIconPersonCircle, BIconSun, BIconMoon,
} from 'bootstrap-icons-vue';
import { useTheme } from '@/composable/useTheme';
import { useProfileStore } from '@/store/profile';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const profileStore = useProfileStore();

const { toggleTheme } = useTheme();
const { profile } = storeToRefs(profileStore);
</script>

<style scoped lang="scss">
.header {
  @apply bg-slate-400 dark:bg-slate-700;

  .header-inner {
    @apply px-8 py-7 flex justify-between items-center;

    .header-title {
      @apply flex gap-2;
      @apply no-underline;
    }
  }
}

.settings-button {
  svg {
    @apply w-5 h-5;
  }
}

.settings-menu {
  @apply bg-slate-200 dark:bg-slate-800;

  .menu-item {
    @apply flex items-center gap-2;
    @apply py-2.5 px-4;
    @apply whitespace-nowrap;
    @apply no-underline;
    @apply cursor-pointer;

    &:hover {
      @apply bg-slate-300 dark:bg-slate-600;
    }

    .menu-item__icon {
      @apply opacity-60;

      svg {
        @apply w-4 h-4;
      }
    }
  }
}
</style>