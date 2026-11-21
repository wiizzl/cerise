<script setup lang="ts">
import type { Entry } from "#/lib/schema";

defineProps<{ steps: Entry[] }>();
</script>

<template>
  <p v-if="!steps.length" class="text-sm text-dimmed">
    Aucune étape dans l'aller.
  </p>
  <ol v-else class="list-inside list-decimal space-y-1 text-sm text-muted">
    <li v-for="step in steps" :key="step.id">{{ step.text || "Étape" }}</li>
  </ol>
</template>
