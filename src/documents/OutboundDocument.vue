<script setup lang="ts">
import Lines from "#/documents/Lines";

import type { Loop } from "#/lib/loop";

defineProps<{ loop: Loop }>();
</script>

<template>
  <template v-if="loop.outbound.context.trim()">
    <h1>Contexte</h1>
    <p><Lines :text="loop.outbound.context" /></p>
  </template>

  <template v-if="loop.outbound.keywords.length">
    <h1>Mots clés</h1>
    <p>{{ loop.outbound.keywords.join(", ") }}</p>
  </template>

  <template v-if="loop.outbound.unknownWords.length">
    <h1>Mots inconnus</h1>
    <p>{{ loop.outbound.unknownWords.join(", ") }}</p>
  </template>

  <template v-if="loop.outbound.problem.trim()">
    <h1>Problématique</h1>
    <p><Lines :text="loop.outbound.problem" /></p>
  </template>

  <template v-if="loop.outbound.constraints.length">
    <h1>Contraintes</h1>
    <ul>
      <li v-for="c in loop.outbound.constraints" :key="c.id">{{ c.text }}</li>
    </ul>
  </template>

  <template v-if="loop.outbound.deliverables.length">
    <h1>Livrables</h1>
    <ul>
      <li v-for="d in loop.outbound.deliverables" :key="d.id">{{ d.text }}</li>
    </ul>
  </template>

  <template v-if="loop.outbound.generalization.trim()">
    <h1>Généralisation</h1>
    <p><Lines :text="loop.outbound.generalization" /></p>
  </template>

  <template v-if="loop.outbound.hypotheses.length">
    <h1>Pistes de solution</h1>
    <ul>
      <li v-for="h in loop.outbound.hypotheses" :key="h.id">{{ h.text }}</li>
    </ul>
  </template>

  <template v-if="loop.outbound.actionPlan.length">
    <h1>Plan d'action</h1>
    <ol>
      <li v-for="s in loop.outbound.actionPlan" :key="s.id">{{ s.text }}</li>
    </ol>
  </template>
</template>
