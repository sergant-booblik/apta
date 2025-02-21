import type { Router } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { RouteName } from '@/router';

export function setupRouterGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.matched.some((record) => record.meta.auth)) {
      authStore.verifyToken()
        .then((result) => {
          if (!result.success) {
            return authStore.refreshToken();
          }
        })
        .then(() => {
          if (to.name === RouteName.LOGIN || to.name === RouteName.REGISTER) {
            next({ name: RouteName.HOME });
          } else {
            next();
          }
        })
        .catch(() => {
          authStore.logout();
          next({ name: RouteName.LOGIN });
        });
    } else {
      next();
    }
  });
}
