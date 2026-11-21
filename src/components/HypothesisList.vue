<script setup lang="ts">
import StatusSelect from "#/components/StatusSelect.vue";

import type { Entry, Status } from "#/lib/schema";

defineProps<{ hypotheses: Entry[] }>();

const statuses = defineModel<Record<string, Status>>("statuses", {
  required: true,
});
const notes = defineModel<Record<string, string>>("notes", { required: true });
</script>

<template>
  <p v-if="!hypotheses.length" class="text-sm text-dimmed">
    Aucune piste dans l'aller.
  </p>
  <div v-for="h in hypotheses" :key="h.id" class="space-y-2">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <p class="font-medium text-highlighted">
        {{ h.text || "Piste sans intitulé" }}
      </p>
      <StatusSelect v-model="statuses[h.id]" class="w-40" />
    </div>
    <UTextarea v-model="notes[h.id]" autoresize :rows="2" class="w-full" />
  </div>
</template>
