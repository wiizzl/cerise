<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { computed } from "vue";

import { busy, useActions } from "#/lib/actions";
import { Loop, type LoopEntry } from "#/lib/loop";
import { settings } from "#/lib/settings";

const { open, remove } = useActions();

const {
  state: loops,
  isLoading,
  error,
  execute,
} = useAsyncState(
  async () => Loop.entries(await settings.repository.list()),
  undefined,
  {
    resetOnExecute: false,
  },
);

const errorMessage = computed(() => {
  return error.value instanceof Error ? error.value.message : "";
});

async function removeLoop(entry: LoopEntry) {
  if (await remove(entry)) {
    loops.value = loops.value?.filter(
      (loop) => loop.file.name !== entry.file.name,
    );
  }
}
</script>

<template>
  <section class="space-y-3">
    <div class="flex items-center justify-between gap-2">
      <h2 class="text-lg font-semibold text-highlighted">Mes boucles</h2>
      <UButton
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="ghost"
        size="sm"
        :loading="isLoading"
        aria-label="Actualiser"
        @click="execute()"
      />
    </div>
    <UAlert
      v-if="errorMessage"
      color="error"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      :title="errorMessage"
      :actions="[
        {
          label: 'Paramètres',
          to: '/settings',
          color: 'error',
          variant: 'outline',
        },
      ]"
    />
    <div v-else-if="!loops" class="space-y-2">
      <USkeleton v-for="i in 3" :key="i" class="h-10 w-full" />
    </div>
    <p v-else-if="!loops.length" class="text-sm text-dimmed">
      Aucune boucle pour l'instant.
    </p>
    <ul v-else class="divide-y divide-default rounded-lg border border-default">
      <li
        v-for="entry in loops"
        :key="entry.file.name"
        class="flex items-center gap-1 pr-2"
      >
        <button
          type="button"
          class="flex flex-1 items-center justify-between gap-2 px-4 py-2.5 text-left hover:bg-elevated/50"
          :disabled="!!busy.open"
          @click="open(entry)"
        >
          <span class="flex items-center gap-2 font-medium text-highlighted">
            {{ Loop.label(entry.file) }}
            <UBadge
              v-if="entry.cer"
              label="CER déposé"
              color="success"
              variant="subtle"
              size="sm"
            />
          </span>
          <UIcon
            :name="
              busy.open === entry.file.name
                ? 'i-lucide-loader-circle'
                : 'i-lucide-chevron-right'
            "
            class="size-4 text-muted"
            :class="{ 'animate-spin': busy.open === entry.file.name }"
          />
        </button>
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          size="sm"
          :loading="busy.remove === entry.file.name"
          :aria-label="`Supprimer ${Loop.label(entry.file)}`"
          @click="removeLoop(entry)"
        />
      </li>
    </ul>
  </section>
</template>
