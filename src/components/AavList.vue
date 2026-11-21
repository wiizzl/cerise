<script setup lang="ts">
import StatusSelect from "#/components/StatusSelect.vue";

import { type Aav, newId } from "#/lib/schema";

const items = defineModel<Aav[]>({ required: true });
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="flex flex-wrap items-center gap-2 sm:flex-nowrap"
    >
      <UInput
        v-model="item.level"
        placeholder="Niveau"
        aria-label="Niveau"
        class="w-24 shrink-0"
      />
      <UInput
        v-model="item.label"
        placeholder="Intitulé"
        aria-label="Intitulé"
        class="min-w-0 flex-1"
      />
      <StatusSelect
        v-model="item.status"
        aria-label="Statut"
        class="order-last w-full sm:order-0 sm:w-40 sm:shrink-0"
      />
      <UButton
        icon="i-lucide-trash-2"
        color="error"
        variant="ghost"
        aria-label="Supprimer"
        class="shrink-0"
        @click="items.splice(index, 1)"
      />
    </div>
    <UButton
      icon="i-lucide-plus"
      label="Ajouter"
      color="neutral"
      variant="soft"
      size="sm"
      @click="items.push({ id: newId(), level: '', label: '', status: null })"
    />
  </div>
</template>
