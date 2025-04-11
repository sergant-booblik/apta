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
import Icon from "@/components/icons";
import DropdownComponent from '@/components/DropdownComponent.vue'
import router, { RouteName } from '@/router';
import { useAuthStore } from '@/store/auth'
import { BIconThreeDotsVertical, BIconDoorOpen, BIconGear, BIconPersonCircle } from 'bootstrap-icons-vue'



const authStore = useAuthStore();
</script>
