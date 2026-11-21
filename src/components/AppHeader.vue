<script setup lang="ts">
import { busy, useActions } from "#/lib/actions";
import { session } from "#/lib/session";

const { sync } = useActions();
</script>

<template>
  <header
    class="sticky top-0 z-20 border-b border-muted bg-default/80 backdrop-blur print:hidden"
  >
    <UContainer class="flex h-14 items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-3">
        <RouterLink
          to="/"
          class="flex shrink-0 items-center gap-2 font-semibold text-highlighted"
        >
          <img src="/logo.png" alt="" class="size-7 dark:hidden">
          <img src="/logo-dark.png" alt="" class="hidden size-7 dark:block">
          <span class="hidden sm:inline">Cerise</span>
        </RouterLink>
        <template v-if="session.loop">
          <USeparator orientation="vertical" class="h-6" />
          <span class="truncate text-sm font-medium">{{
            session.loop.title
          }}</span>
          <UBadge
            :label="session.dirty ? 'Non synchronisé' : 'Synchronisé'"
            :color="session.dirty ? 'warning' : 'success'"
            variant="subtle"
            size="sm"
            class="hidden shrink-0 sm:inline-flex"
          />
        </template>
      </div>
      <div class="flex shrink-0 items-center gap-1">
        <UButton
          v-if="session.loop"
          icon="i-lucide-cloud-upload"
          :variant="session.dirty ? 'solid' : 'soft'"
          :loading="busy.sync"
          aria-label="Synchroniser le dépôt"
          @click="sync"
        >
          <span class="hidden sm:inline">Synchroniser</span>
        </UButton>
        <UButton
          to="/settings"
          icon="i-lucide-settings"
          color="neutral"
          variant="ghost"
          aria-label="Paramètres"
        />
        <UColorModeButton />
      </div>
    </UContainer>
  </header>
</template>
