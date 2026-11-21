<script setup lang="ts">
import { computed } from "vue";

import AavList from "#/components/AavList.vue";
import DefinitionList from "#/components/DefinitionList.vue";
import FormSection from "#/components/FormSection.vue";
import HypothesisList from "#/components/HypothesisList.vue";
import QuestionList from "#/components/QuestionList.vue";
import RichField from "#/components/RichField.vue";
import StepList from "#/components/StepList.vue";

import { session } from "#/lib/session";

const outbound = computed(() => session.loop?.outbound);
const feedback = computed(() => session.loop?.return);
</script>

<template>
  <div v-if="outbound && feedback" class="divide-y divide-default">
    <FormSection title="Mots inconnus" icon="i-lucide-circle-help">
      <DefinitionList
        v-model="feedback.definitions"
        :words="outbound.unknownWords"
      />
    </FormSection>

    <FormSection title="Pistes de solution" icon="i-lucide-lightbulb">
      <HypothesisList
        v-model:statuses="feedback.verdicts"
        v-model:notes="feedback.comments"
        :hypotheses="outbound.hypotheses"
      />
    </FormSection>

    <FormSection title="Plan d'action" icon="i-lucide-list-ordered">
      <StepList :steps="outbound.actionPlan" />
      <RichField v-model="feedback.actionPlan" />
    </FormSection>

    <FormSection title="AAV" icon="i-lucide-badge-check">
      <AavList v-model="feedback.aavs" />
    </FormSection>

    <FormSection
      title="Questions du tuteur"
      icon="i-lucide-message-circle-question"
    >
      <QuestionList v-model="feedback.questions" />
    </FormSection>
  </div>
</template>
