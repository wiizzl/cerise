<script setup lang="ts">
import FieldTable from "#/documents/FieldTable.vue";

import type { Loop } from "#/lib/loop";
import type { Entry } from "#/lib/schema";

const props = defineProps<{ loop: Loop }>();

const orBlank = <T>(items: T[], blank: T) => (items.length ? items : [blank]);

const lines = (entries: Entry[]) => entries.map((e) => e.text).join("\n");

const context = (
  [
    ["Mots-clés", props.loop.outbound.keywords.join(", ")],
    ["Problématique", props.loop.outbound.problem],
    ["Contraintes", lines(props.loop.outbound.constraints)],
    ["Livrables", lines(props.loop.outbound.deliverables)],
    ["Généralisation", props.loop.outbound.generalization],
  ] satisfies [string, string][]
).filter(([, value]) => value.trim());

const words = orBlank(props.loop.outbound.unknownWords, "");
const hypotheses = orBlank(props.loop.outbound.hypotheses, {
  id: "",
  text: "Piste",
});
const steps = orBlank(props.loop.outbound.actionPlan, { id: "", text: "" });
</script>

<template>
  <FieldTable v-if="context.length" :rows="context" />

  <h1>Mots inconnus</h1>
  <table>
    <colgroup>
      <col style="width: 30%">
      <col style="width: 70%">
    </colgroup>
    <thead>
      <tr>
        <th>Mot</th>
        <th>Définition</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="w in words" :key="w">
        <td>
          <strong>{{ w }}</strong>
        </td>
        <td><span class="placeholder">Écris ici…</span></td>
      </tr>
    </tbody>
  </table>

  <h1>Pistes de solution</h1>
  <template v-for="h in hypotheses" :key="h.id">
    <h2>{{ h.text }}</h2>
    <FieldTable
      :rows="[
        ['Statut', '☐ Validée     ☐ Partielle     ☐ Invalidée'],
        ['Justification', null],
      ]"
    />
  </template>

  <h1>Plan d'action</h1>
  <template v-for="(s, index) in steps" :key="s.id">
    <h2>Étape {{ index + 1 }} · {{ s.text }}</h2>
    <p>
      <span class="placeholder">Ce que j'ai fait, ce que j'en retiens…</span>
    </p>
  </template>
</template>
