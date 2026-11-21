<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { useActions } from "#/lib/actions";
import { Repo } from "#/lib/repo";
import { type SettingsData, settingsSchema } from "#/lib/schema";
import { settings } from "#/lib/settings";

const router = useRouter();
const { saveSettings } = useActions();

const state = reactive<SettingsData>({
  repo: settings.repo,
  token: settings.token,
});
const firstTime = !settings.isConfigured;
const checking = ref(false);

async function onSubmit(event: FormSubmitEvent<SettingsData>) {
  checking.value = true;

  const saved = await saveSettings(event.data);

  checking.value = false;

  if (saved && firstTime) {
    await router.push({ name: "home" });
  }
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-highlighted">
      {{ firstTime ? "Bienvenue" : "Paramètres" }}
    </h1>

    <ol class="space-y-4 text-sm">
      <li class="space-y-2">
        <p class="font-medium text-highlighted">1. Crée un dépôt privé</p>
        <UButton
          :to="Repo.createUrl"
          target="_blank"
          icon="i-lucide-folder-plus"
          label="Créer le dépôt"
          color="neutral"
          variant="outline"
          size="sm"
        />
      </li>
      <li class="space-y-2">
        <p class="font-medium text-highlighted">2. Crée un token</p>
        <p class="text-muted">
          Dans "Repository access", choisis "Only select repositories" puis ton
          dépôt. La permission "Contents" est déjà en lecture et écriture.
        </p>
        <UButton
          :to="Repo.tokenUrl"
          target="_blank"
          icon="i-lucide-key-round"
          label="Créer le token"
          color="neutral"
          variant="outline"
          size="sm"
        />
      </li>
      <li>
        <p class="font-medium text-highlighted">
          3. Renseigne tes informations
        </p>
      </li>
    </ol>

    <UForm
      :schema="settingsSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField name="repo" label="Dépôt" required>
        <UInput
          v-model="state.repo"
          placeholder="username/repo"
          class="w-full"
        />
      </UFormField>
      <UFormField name="token" label="Token" required>
        <UInput
          v-model="state.token"
          type="password"
          placeholder="github_pat_…"
          autocomplete="off"
          class="w-full"
        />
      </UFormField>
      <div>
        <UButton
          type="submit"
          :loading="checking"
          :label="firstTime ? 'Commencer' : 'Enregistrer'"
          icon="i-lucide-check"
        />
      </div>
    </UForm>
  </div>
</template>
