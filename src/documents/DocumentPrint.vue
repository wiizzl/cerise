<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { computed } from "vue";
import { useRoute } from "vue-router";

import OutboundDocument from "#/documents/OutboundDocument.vue";
import ReturnDocument from "#/documents/ReturnDocument.vue";
import { themeVars } from "#/documents/theme";

import { session } from "#/lib/session";

const route = useRoute();

const documents = {
  outbound: { label: "Prosit aller", component: OutboundDocument },
  return: { label: "Prosit retour", component: ReturnDocument },
};

const kind = computed(() =>
  route.name === "return" ? ("return" as const) : ("outbound" as const),
);

useEventListener(window, "beforeprint", () => {
  if (session.loop) {
    document.title = session.loop.fileName(kind.value);
  }
});

useEventListener(window, "afterprint", () => {
  document.title = "Cerise";
});
</script>

<template>
  <article v-if="session.loop" class="print-doc" :style="themeVars">
    <p class="kicker">{{ documents[kind].label }}</p>
    <p class="title">{{ session.loop.title }}</p>
    <component :is="documents[kind].component" :loop="session.loop" />
  </article>
</template>
