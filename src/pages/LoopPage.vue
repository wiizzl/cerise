<script setup lang="ts">
import LoopNav from "#/components/LoopNav.vue";

import DocumentPrint from "#/documents/DocumentPrint.vue";

import { session } from "#/lib/session";
</script>

<template>
  <template v-if="session.loop">
    <div class="space-y-6 print:hidden">
      <LoopNav />
      <RouterView />
    </div>
    <DocumentPrint class="hidden print:block" />
  </template>
</template>
