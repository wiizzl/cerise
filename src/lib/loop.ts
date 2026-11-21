import type { z } from "zod";

import type { RepoFile } from "#/lib/repo";
import {
  type LoopData,
  type Outbound,
  type Return,
  loopSchema,
  newId,
  newOutbound,
  newReturn,
} from "#/lib/schema";

function parse<T>(text: string, schema: z.ZodType<T>): T {
  let data: unknown;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Fichier illisible.");
  }

  const result = schema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    throw new Error(
      `Fichier invalide (${issue?.path.join(".") || "racine"} : ${issue?.message}).`,
    );
  }

  return result.data;
}

function slug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function idSuffix(id: string) {
  return `-${id.replace(/-/g, "").slice(0, 8)}`;
}

export interface LoopEntry {
  file: RepoFile;
  cer?: RepoFile;
}

const CER_SUFFIX = ".cer.docx";

export class Loop {
  id: string;
  outbound: Outbound;
  return: Return;

  constructor(data: LoopData) {
    this.id = data.id;
    this.outbound = data.outbound;
    this.return = data.return;
  }

  static create() {
    return new Loop({
      id: newId(),
      outbound: newOutbound(),
      return: newReturn(),
    });
  }

  static fromJson(json: string) {
    return new Loop(parse(json, loopSchema));
  }

  static async fromFile(file: Blob) {
    return Loop.fromJson(await file.text());
  }

  static entries(files: RepoFile[]): LoopEntry[] {
    return files
      .filter((file) => file.name.endsWith(".json"))
      .map((file) => ({
        file,
        cer: files.find((cer) => cer.name === Loop.cerName(file)),
      }));
  }

  static findEntry(entries: LoopEntry[], loopId: string) {
    return entries.find(({ file }) =>
      file.name.endsWith(`${idSuffix(loopId)}.json`),
    );
  }

  static cerName(file: RepoFile) {
    return file.name.replace(/\.json$/, CER_SUFFIX);
  }

  static label(file: RepoFile) {
    return file.name
      .replace(/\.json$/, "")
      .replace(/-[0-9a-f]{8}$/, "")
      .replace(/^loop-/, "Boucle ")
      .replace(/-/g, " ");
  }

  get title() {
    const ue = this.outbound.ue.trim();

    return `Boucle ${this.outbound.loop}${ue ? ` : ${ue}` : ""}`;
  }

  get summary() {
    const ue = this.outbound.ue.trim();

    return `loop ${this.outbound.loop}${ue ? ` (${ue})` : ""}`;
  }

  get slugName() {
    return ["loop", this.outbound.loop, slug(this.outbound.ue)]
      .filter(Boolean)
      .join("-");
  }

  get repoName() {
    return `${this.slugName}${idSuffix(this.id)}.json`;
  }

  apply(loop: Loop) {
    this.outbound = loop.outbound;
    this.return = loop.return;
  }

  fileName(kind: "prosits" | "outbound" | "return" | "cer") {
    return `${kind}-${this.slugName}`;
  }

  toJSON(): LoopData {
    return { id: this.id, outbound: this.outbound, return: this.return };
  }

  toJson() {
    return JSON.stringify(this);
  }

  toBlob() {
    return new Blob([this.toJson()], { type: "application/json" });
  }
}
