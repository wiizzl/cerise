<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description: string;
    confirmLabel?: string;
    color?: "primary" | "error" | "warning";
  }>(),
  { confirmLabel: "Continuer", color: "primary" },
);

const emit = defineEmits<{ close: [confirmed: boolean] }>();
</script>

<template>
  <UModal :title="title" :close="false" :dismissible="false">
    <template #body>
      <p class="text-sm">{{ description }}</p>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          label="Annuler"
          color="neutral"
          variant="ghost"
          @click="emit('close', false)"
        />
        <UButton
          :label="confirmLabel"
          :color="color"
          @click="emit('close', true)"
        />
      </div>
    </template>
  </UModal>
</template>
