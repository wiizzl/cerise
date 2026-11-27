<script setup lang="ts">
import Lines from "#/documents/Lines";

defineProps<{ rows: [label: string, value: string | null][] }>();
</script>

<template>
  <table class="fields">
    <colgroup>
      <col style="width: 30%">
      <col style="width: 70%">
    </colgroup>
    <tbody>
      <tr v-for="[ label, value ] in rows" :key="label">
        <th>{{ label }}</th>
        <td>
          <Lines v-if="value !== null" :text="value" />
          <span v-else class="placeholder">...</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
