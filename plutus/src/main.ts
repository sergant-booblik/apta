import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import i18n from '@/logic/i18n';
import { BootstrapIconsPlugin } from 'bootstrap-icons-vue';
import { setupRouterGuard } from '@/logic/setup-router-guard';
import { applyTheme, getInitialTheme, getStoredTheme } from '@/logic/theme';

const app = createApp(App);
const pinia = createPinia();

app.use(BootstrapIconsPlugin);
app.use(pinia);
app.use(i18n);
app.use(router);

setupRouterGuard(router, pinia);
const initial = getStoredTheme() || getInitialTheme();
applyTheme(initial);
app.mount('#app');
