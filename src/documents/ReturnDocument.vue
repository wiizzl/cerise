<script setup lang="ts">
import Lines from "#/documents/Lines";
import RichView from "#/documents/RichView";

import type { Loop } from "#/lib/loop";
import { type Status, statusLabels } from "#/lib/schema";

defineProps<{ loop: Loop }>();

const statusLabel = (status?: Status | null) =>
  status ? statusLabels[status] : "";
</script>

<template>
  <template v-if="loop.outbound.unknownWords.length">
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
        <tr v-for="w in loop.outbound.unknownWords" :key="w">
          <td><strong>{{ w }}</strong></td>
          <td><Lines :text="loop.return.definitions[w] ?? ''" /></td>
        </tr>
      </tbody>
    </table>
  </template>

  <template v-if="loop.outbound.hypotheses.length">
    <h1>Pistes de solution</h1>
    <ul>
      <li v-for="h in loop.outbound.hypotheses" :key="h.id">
        {{ h.text }}
        <template v-if="loop.return.verdicts[h.id]">
          — <strong>{{ statusLabel(loop.return.verdicts[h.id]) }}</strong>
        </template>
        <template v-if="loop.return.comments[h.id]?.trim()">
          <br>
          <Lines :text="loop.return.comments[h.id] ?? ''" />
        </template>
      </li>
    </ul>
  </template>

  <template v-if="loop.return.actionPlan?.content?.length">
    <h1>Plan d'action</h1>
    <RichView :doc="loop.return.actionPlan" />
  </template>

  <template v-if="loop.return.aavs.length">
    <h1>AAV</h1>
    <table>
      <colgroup>
        <col style="width: 15%">
        <col style="width: 65%">
        <col style="width: 20%">
      </colgroup>
      <thead>
        <tr>
          <th>Niveau</th>
          <th>Intitulé</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in loop.return.aavs" :key="a.id">
          <td>{{ a.level }}</td>
          <td>{{ a.label }}</td>
          <td>{{ statusLabel(a.status) }}</td>
        </tr>
      </tbody>
    </table>
  </template>

  <template v-if="loop.return.questions.length">
    <h1>Questions du tuteur</h1>
    <ul>
      <li v-for="q in loop.return.questions" :key="q.id">
        <strong>{{ q.question }}</strong>
        <template v-if="q.answer.trim()">
          <br>
          <Lines :text="q.answer" />
        </template>
      </li>
    </ul>
  </template>
</template>
