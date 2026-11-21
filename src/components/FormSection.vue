<script setup lang="ts">
defineProps<{ title: string; description?: string; icon?: string }>();
</script>

<template>
  <section class="space-y-3 py-6 first:pt-0 last:pb-0">
    <div>
      <h2
        class="flex items-center gap-2 text-lg font-semibold text-highlighted"
      >
        <UIcon v-if="icon" :name="icon" class="size-5 text-primary" />
        {{ title }}
      </h2>
      <p v-if="description" class="text-sm text-muted">{{ description }}</p>
    </div>
    <slot />
  </section>
</template>
