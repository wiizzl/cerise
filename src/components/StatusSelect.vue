<script setup lang="ts">
import { type Status, statusLabels } from "#/lib/schema";

const status = defineModel<Status | null>();

const items = (Object.keys(statusLabels) as Status[]).map((value) => ({
  value,
  label: statusLabels[value],
}));

const colors = {
  validated: "success",
  partial: "warning",
  invalidated: "error",
} as const;
</script>

<template>
  <USelect
    :model-value="status ?? undefined"
    :items="items"
    placeholder="Statut"
    :color="status ? colors[status] : 'neutral'"
    highlight
    @update:model-value="status = $event"
  />
</template>
