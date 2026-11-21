<script setup lang="ts">
import LoopList from "#/components/LoopList.vue";

import { useActions } from "#/lib/actions";
import { session } from "#/lib/session";

const { create, importProsits, close } = useActions();
</script>

<template>
  <div class="space-y-10">
    <UCard v-if="session.loop">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm text-muted">Boucle ouverte</p>
          <p class="text-lg font-semibold text-highlighted">
            {{ session.loop.title }}
          </p>
          <p v-if="session.dirty" class="text-sm text-warning">
            Pas encore synchronisée avec le dépôt.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <UButton
            icon="i-lucide-arrow-right"
            label="Continuer"
            :to="{ name: 'outbound' }"
          />
          <UButton
            icon="i-lucide-x"
            label="Fermer"
            color="neutral"
            variant="ghost"
            @click="close"
          />
        </div>
      </div>
    </UCard>

    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-highlighted">
        On est sur quelle boucle ?
      </h1>

      <div class="grid gap-3 sm:grid-cols-2">
        <UButton
          icon="i-lucide-file-input"
          label="Importer des prosits"
          size="lg"
          block
          @click="importProsits"
        />
        <UButton
          icon="i-lucide-file-plus"
          label="Nouvelle boucle"
          size="lg"
          color="neutral"
          variant="outline"
          block
          @click="create"
        />
      </div>
    </div>

    <LoopList />
  </div>
</template>
