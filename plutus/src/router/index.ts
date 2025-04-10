import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import LoginView from '@/views/LoginView.vue';
import BillsView from '@/views/BillsView.vue';
import SettingsView from '@/views/SettingsView.vue';
import ExpensesView from '@/views/ExpensesView.vue';
import RegisterView from '@/views/RegisterView.vue';

export enum RouteName {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  BILLS = 'BILLS',
  EXPENSES = 'EXPENSES',
  SETTINGS = 'SETTINGS',
}

export enum Layout {
  MAIN = 'main',
  EMPTY = 'empty',
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: RouteName.HOME,
    meta: { auth: true, layout: Layout.MAIN },
    component: DashboardView
  },
  {
    path: '/login',
    name: RouteName.LOGIN,
    meta: { auth: false, layout: Layout.EMPTY },
    component: LoginView
  },
  {
    path: '/register',
    name: RouteName.REGISTER,
    meta: { auth: false, layout: Layout.EMPTY },
    component: RegisterView,
  },
  {
    path: '/accounts',
    name: RouteName.BILLS,
    meta: { auth: true, layout: Layout.MAIN },
    component: BillsView,
  },
  {
    path: '/expenses',
    name: RouteName.EXPENSES,
    meta: { auth: true, layout: Layout.MAIN },
    component: ExpensesView,
  },
  {
    path: '/settings',
    name: RouteName.SETTINGS,
    meta: { auth: true, layout: Layout.MAIN },
    component: SettingsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
