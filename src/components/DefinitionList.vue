<script setup lang="ts">
defineProps<{ words: string[] }>();

const definitions = defineModel<Record<string, string>>({ required: true });
</script>

<template>
  <p v-if="!words.length" class="text-sm text-dimmed">
    Aucun mot inconnu dans l'aller.
  </p>
  <UFormField v-for="word in words" :key="word" :label="word">
    <UTextarea
      v-model="definitions[word]"
      autoresize
      :rows="2"
      class="w-full"
    />
  </UFormField>
</template>
