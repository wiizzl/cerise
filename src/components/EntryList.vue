<script setup lang="ts">
import { nextTick, useTemplateRef } from "vue";

import { type Entry, newId } from "#/lib/schema";

const items = defineModel<Entry[]>({ required: true });

defineProps<{ numbered?: boolean }>();

const inputs = useTemplateRef<{ inputRef?: HTMLInputElement }[]>("inputs");

async function add(after?: number) {
  const index = after === undefined ? items.value.length : after + 1;

  items.value.splice(index, 0, { id: newId(), text: "" });

  await nextTick();
  inputs.value?.[index]?.inputRef?.focus();
}

function remove(index: number) {
  items.value.splice(index, 1);
}

function move(index: number, delta: -1 | 1) {
  const target = index + delta;
  if (target < 0 || target >= items.value.length) {
    return;
  }

  const [item] = items.value.splice(index, 1);
  if (item) {
    items.value.splice(target, 0, item);
  }
}
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="flex items-center gap-2"
    >
      <span
        v-if="numbered"
        class="w-6 shrink-0 text-right text-sm text-muted tabular-nums"
      >
        {{ index + 1 }}.
      </span>
      <UInput
        ref="inputs"
        v-model="item.text"
        class="flex-1"
        @keydown.enter.prevent="add(index)"
      />
      <UFieldGroup>
        <UButton
          icon="i-lucide-arrow-up"
          color="neutral"
          variant="ghost"
          :disabled="index === 0"
          aria-label="Monter"
          @click="move(index, -1)"
        />
        <UButton
          icon="i-lucide-arrow-down"
          color="neutral"
          variant="ghost"
          :disabled="index === items.length - 1"
          aria-label="Descendre"
          @click="move(index, 1)"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          aria-label="Supprimer"
          @click="remove(index)"
        />
      </UFieldGroup>
    </div>
    <UButton
      icon="i-lucide-plus"
      label="Ajouter"
      color="neutral"
      variant="soft"
      size="sm"
      @click="add()"
    />
  </div>
</template>
