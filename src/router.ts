import { createRouter, createWebHistory } from "vue-router";

import { session, sessionReady } from "#/lib/session";
import { settings, settingsReady } from "#/lib/settings";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("#/pages/HomePage.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("#/pages/SettingsPage.vue"),
    },
    {
      path: "/loop",
      component: () => import("#/pages/LoopPage.vue"),
      meta: { loop: true },
      children: [
        {
          path: "outbound",
          name: "outbound",
          component: () => import("#/pages/OutboundPage.vue"),
        },
        {
          path: "return",
          name: "return",
          component: () => import("#/pages/ReturnPage.vue"),
        },
      ],
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

router.beforeEach(async (to) => {
  await Promise.all([settingsReady, sessionReady]);

  if (!settings.isConfigured && to.name !== "settings") {
    return { name: "settings" };
  }

  if (to.meta.loop && !session.loop) {
    return { name: "home" };
  }
});
