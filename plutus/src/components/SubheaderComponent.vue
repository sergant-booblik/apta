<template>
  <div class="subheader">
    <div class="subheader-inner">
      <div class="menu">
        <div
          v-for="(item, index) in menu"
          :key="index"
          class="menu-item"
        >
          <router-link
            :to="`/${item.name}`"
            exact
            exact-active-class="menu-item-link--active"
            class="menu-item-link"
          >
            <component
              :is="item.icon"
            />
            {{ t(`Header.Subheader.Menu.${item.name}`) }}
          </router-link>
        </div>
        <div class="menu-item">
          <ButtonComponent
            :label="t('!LOGOUT!')"
            @click="authStore.logout(router)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuIcon from "@/components/icons/menu";
import { useI18n } from 'vue-i18n'
import ButtonComponent from '@/components/ButtonComponent.vue'
import { useAuthStore } from '@/store/auth'
import router from '@/router'

const { t } = useI18n();

const authStore = useAuthStore();

const menu = [
  { name: 'accounts', icon: MenuIcon.AccountsIcon },
  { name: 'expenses', icon: MenuIcon.ExpensesIcon },
];
</script>
