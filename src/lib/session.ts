import { useEventListener, watchDebounced } from "@vueuse/core";
import { del, get, set } from "idb-keyval";
import { reactive } from "vue";

import { Loop, type LoopEntry } from "#/lib/loop";
import type { Repo, RepoFile } from "#/lib/repo";

interface Saved {
  json: string;
  dirty: boolean;
  file?: RepoFile;
  cer?: RepoFile;
}

export class Session {
  loop: Loop | undefined = undefined;
  file: RepoFile | undefined = undefined;
  cer: RepoFile | undefined = undefined;
  dirty = false;

  private synced = "";

  async open(loop: Loop, entry?: LoopEntry) {
    this.loop = loop;
    this.file = entry?.file;
    this.cer = entry?.cer;
    this.synced = entry ? loop.toJson() : "";

    await this.save();
  }

  async openEntry(repo: Repo, entry: LoopEntry) {
    await this.open(
      Loop.fromJson(await (await repo.read(entry.file)).text()),
      entry,
    );
  }

  async importProsits(repo: Repo, imported: Loop) {
    if (this.loop?.id === imported.id) {
      this.loop.apply(imported);

      return;
    }

    const entry = Loop.findEntry(Loop.entries(await repo.list()), imported.id);

    if (entry) {
      await this.openEntry(repo, entry);
      this.loop?.apply(imported);
    } else {
      await this.open(imported);
    }
  }

  async sync(repo: Repo, overwrite = false) {
    if (!this.loop) {
      return;
    }

    const json = this.loop.toJson();

    this.file = await repo.write(
      this.file?.name ?? this.loop.repoName,
      this.loop.toBlob(),
      {
        sha: this.file?.sha,
        message: `${this.file ? "docs: update" : "feat: add"} ${this.loop.summary}`,
        overwrite,
      },
    );
    this.synced = json;

    await this.save();
  }

  async uploadCer(repo: Repo, docx: File) {
    if (!this.loop) {
      return;
    }

    if (!this.file) {
      await this.sync(repo);
    }

    if (!this.file) {
      return;
    }

    this.cer = await repo.write(Loop.cerName(this.file), docx, {
      message: `docs: ${this.cer ? "update" : "add"} CER ${this.loop.summary}`,
      overwrite: true,
    });

    await this.save();
  }

  async close() {
    this.loop = undefined;
    this.file = undefined;
    this.cer = undefined;
    this.dirty = false;
    this.synced = "";

    await del("loop");
  }

  async save() {
    if (!this.loop) {
      return;
    }

    const json = this.loop.toJson();
    this.dirty = json !== this.synced;

    await set("loop", {
      json,
      dirty: this.dirty,
      file: this.file && { ...this.file },
      cer: this.cer && { ...this.cer },
    } satisfies Saved);
  }

  async restore() {
    const saved = await get<Saved>("loop");
    if (!saved) {
      return;
    }

    try {
      this.loop = Loop.fromJson(saved.json);
    } catch {
      return;
    }

    this.file = saved.file;
    this.cer = saved.cer;
    this.dirty = saved.dirty;
    this.synced = saved.dirty ? "" : this.loop.toJson();
  }
}

export const session = reactive(new Session());
export const sessionReady = session.restore();

watchDebounced(
  () => session.loop,
  () => session.save(),
  { deep: true, debounce: 400 },
);

useEventListener(window, "pagehide", () => void session.save());
