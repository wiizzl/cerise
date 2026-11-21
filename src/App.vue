<script setup lang="ts">
import { fr } from "@nuxt/ui/locale";

import AppHeader from "#/components/AppHeader.vue";
</script>

<template>
  <UApp :locale="fr">
    <AppHeader />
    <UContainer as="main" class="py-8 print:max-w-none print:p-0">
      <RouterView />
    </UContainer>
  </UApp>
</template>
