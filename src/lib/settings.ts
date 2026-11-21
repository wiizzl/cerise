import { get, set } from "idb-keyval";
import { markRaw, reactive } from "vue";

import { Repo } from "#/lib/repo";
import { type SettingsData, settingsSchema } from "#/lib/schema";

export class Settings implements SettingsData {
  repo = "";
  token = "";

  get isConfigured() {
    return settingsSchema.safeParse(this).success;
  }

  get repository() {
    return markRaw(new Repo(this.repo, this.token));
  }

  async load() {
    Object.assign(this, await get<SettingsData>("profile"));
  }

  async save(data: SettingsData) {
    Object.assign(this, data);

    await set("profile", { ...data });
  }
}

export const settings = reactive(new Settings());
export const settingsReady = settings.load();
