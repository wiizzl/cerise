<script setup lang="ts">
import { computed } from "vue";

import EntryList from "#/components/EntryList.vue";
import FormSection from "#/components/FormSection.vue";

import { session } from "#/lib/session";

const outbound = computed(() => session.loop?.outbound);
</script>

<template>
  <div v-if="outbound" class="space-y-6">
    <div class="divide-y divide-default">
      <FormSection title="En-tête" icon="i-lucide-heading">
        <div class="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <UFormField label="Boucle">
            <UInputNumber v-model="outbound.loop" :min="1" class="w-full" />
          </UFormField>
          <UFormField label="UE">
            <UInput v-model="outbound.ue" class="w-full" />
          </UFormField>
        </div>
      </FormSection>

      <FormSection title="Contexte" icon="i-lucide-notebook-pen">
        <UTextarea
          v-model="outbound.context"
          autoresize
          :rows="2"
          class="w-full"
        />
      </FormSection>

      <FormSection title="Mots clés" icon="i-lucide-key-round">
        <UInputTags v-model="outbound.keywords" add-on-blur class="w-full" />
      </FormSection>

      <FormSection title="Mots inconnus" icon="i-lucide-circle-help">
        <UInputTags
          v-model="outbound.unknownWords"
          add-on-blur
          class="w-full"
        />
      </FormSection>

      <FormSection title="Problématique" icon="i-lucide-target">
        <UTextarea
          v-model="outbound.problem"
          autoresize
          :rows="2"
          class="w-full"
        />
      </FormSection>

      <FormSection title="Contraintes" icon="i-lucide-lock">
        <EntryList v-model="outbound.constraints" />
      </FormSection>

      <FormSection title="Livrables" icon="i-lucide-package">
        <EntryList v-model="outbound.deliverables" />
      </FormSection>

      <FormSection title="Généralisation" icon="i-lucide-telescope">
        <UTextarea
          v-model="outbound.generalization"
          autoresize
          :rows="2"
          class="w-full"
        />
      </FormSection>

      <FormSection title="Pistes de solution" icon="i-lucide-lightbulb">
        <EntryList v-model="outbound.hypotheses" />
      </FormSection>

      <FormSection title="Plan d'action" icon="i-lucide-list-ordered">
        <EntryList v-model="outbound.actionPlan" numbered />
      </FormSection>
    </div>
  </div>
</template>
