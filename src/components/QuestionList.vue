<script setup lang="ts">
import { type Return, newId } from "#/lib/schema";

const items = defineModel<Return["questions"]>({ required: true });
</script>

<template>
  <div class="space-y-2">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="space-y-2 rounded-lg border border-default p-3"
    >
      <div class="flex items-start gap-2">
        <UTextarea
          v-model="item.question"
          autoresize
          :rows="1"
          placeholder="Question"
          class="flex-1"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          aria-label="Supprimer"
          @click="items.splice(index, 1)"
        />
      </div>
      <UTextarea
        v-model="item.answer"
        autoresize
        :rows="2"
        placeholder="Réponse"
        class="w-full"
      />
    </div>
    <UButton
      icon="i-lucide-plus"
      label="Ajouter"
      color="neutral"
      variant="soft"
      size="sm"
      @click="items.push({ id: newId(), question: '', answer: '' })"
    />
  </div>
</template>
