<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
import { computed } from "vue";

import { useActions } from "#/lib/actions";
import { session } from "#/lib/session";

const {
  importProsits,
  exportProsits,
  downloadCerTemplate,
  uploadCer,
  downloadCer,
  close,
} = useActions();

const print = () => window.print();

const tabs: NavigationMenuItem[] = [
  { label: "Aller", icon: "i-lucide-file-pen", to: { name: "outbound" } },
  { label: "Retour", icon: "i-lucide-graduation-cap", to: { name: "return" } },
];

const menu = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "Exporter les prosits",
      icon: "i-lucide-share-2",
      onSelect: exportProsits,
    },
    {
      label: "Importer des prosits…",
      icon: "i-lucide-file-input",
      onSelect: importProsits,
    },
  ],
  [
    {
      label: "Modèle de CER (.docx)",
      icon: "i-lucide-file-text",
      onSelect: downloadCerTemplate,
    },
    {
      label: session.cer ? "Remplacer mon CER…" : "Déposer mon CER…",
      icon: "i-lucide-upload",
      onSelect: uploadCer,
    },
    ...(session.cer
      ? [
          {
            label: "Télécharger mon CER",
            icon: "i-lucide-download",
            onSelect: downloadCer,
          },
        ]
      : []),
  ],
  [
    {
      label: "Fermer la boucle",
      icon: "i-lucide-x",
      onSelect: close,
    },
  ],
]);
</script>

<template>
  <div class="space-y-3 border-b border-default pb-3">
    <div class="flex items-start justify-between gap-2">
      <h1 class="text-2xl font-bold text-highlighted">
        {{ session.loop?.title }}
      </h1>
      <div class="flex shrink-0 gap-1">
        <UButton
          icon="i-lucide-file-down"
          label="PDF"
          color="neutral"
          variant="outline"
          @click="print"
        />
        <UDropdownMenu :items="menu">
          <UButton
            icon="i-lucide-ellipsis"
            color="neutral"
            variant="ghost"
            aria-label="Actions de la boucle"
          />
        </UDropdownMenu>
      </div>
    </div>
    <UNavigationMenu :items="tabs" highlight highlight-color="secondary" />
  </div>
</template>
