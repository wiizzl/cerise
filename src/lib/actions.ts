import { useFileDialog } from "@vueuse/core";
import { createApp, reactive } from "vue";
import { useRouter } from "vue-router";

import ConfirmModal from "#/components/ConfirmModal.vue";

import CerDocument from "#/documents/CerDocument.vue";

import { Loop, type LoopEntry } from "#/lib/loop";
import { ConflictError, Repo } from "#/lib/repo";
import type { SettingsData } from "#/lib/schema";
import { session } from "#/lib/session";
import { settings } from "#/lib/settings";

export const busy = reactive({ sync: false, open: "", remove: "" });

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = name;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function useActions() {
  const router = useRouter();
  const toast = useToast();
  const confirm = useOverlay().create(ConfirmModal);
  const prositsDialog = useFileDialog({
    accept: ".prosits",
    multiple: false,
    reset: true,
  });
  const cerDialog = useFileDialog({
    accept: ".docx",
    multiple: false,
    reset: true,
  });

  async function attempt<T>(title: string, action: () => Promise<T>) {
    try {
      return await action();
    } catch (error) {
      console.error(error);
      toast.add({
        title,
        description: error instanceof Error ? error.message : String(error),
        color: "error",
        icon: "i-lucide-triangle-alert",
      });
    }
  }

  async function canReplace() {
    await session.save();

    if (!session.loop || !session.dirty) {
      return true;
    }

    return confirm.open({
      title: "Boucle non synchronisée.",
      description:
        "Cette boucle a des modifications qui ne sont pas sur le dépôt. Elles seront perdues.",
      color: "error",
    }).result;
  }

  async function create() {
    if (!(await canReplace())) {
      return;
    }

    await session.open(Loop.create());
    await router.push({ name: "outbound" });
  }

  const importFile = (file: File) =>
    attempt("Import impossible.", async () => {
      const imported = await Loop.fromFile(file);

      if (session.loop?.id !== imported.id && !(await canReplace())) {
        return;
      }

      await session.importProsits(settings.repository, imported);

      toast.add({
        title: "Prosits importés avec succès.",
        description: session.loop?.title,
        color: "success",
        icon: "i-lucide-file-input",
      });

      await router.push({ name: "outbound" });
    });

  prositsDialog.onChange((files) => {
    const file = files?.[0];

    if (file) {
      void importFile(file);
    }
  });

  const importProsits = () => prositsDialog.open();

  function exportProsits() {
    if (session.loop) {
      download(
        session.loop.toBlob(),
        `${session.loop.fileName("prosits")}.prosits`,
      );
    }
  }

  const open = (entry: LoopEntry) =>
    attempt("Ouverture impossible.", async () => {
      if (session.file?.name !== entry.file.name) {
        if (!(await canReplace())) {
          return;
        }

        busy.open = entry.file.name;

        try {
          await session.openEntry(settings.repository, entry);
        } finally {
          busy.open = "";
        }
      }

      await router.push({ name: "outbound" });
    });

  async function overwrite() {
    return confirm.open({
      title: "Décalage de version détecté.",
      description:
        "Sur le dépôt, cette boucle n'est plus celle que tu as ouverte. Cette version remplacera celle du dépôt.",
      color: "warning",
    }).result;
  }

  const sync = () =>
    attempt("Synchronisation impossible.", async () => {
      if (busy.sync) {
        return;
      }

      busy.sync = true;

      try {
        try {
          await session.sync(settings.repository);
        } catch (error) {
          if (!(error instanceof ConflictError) || !(await overwrite())) {
            throw error;
          }

          await session.sync(settings.repository, true);
        }
      } finally {
        busy.sync = false;
      }

      toast.add({
        title: "Synchronisé avec le dépôt avec succès.",
        color: "success",
        icon: "i-lucide-cloud-check",
      });
    });

  const remove = (entry: LoopEntry) =>
    attempt("Suppression impossible.", async () => {
      const ok = await confirm.open({
        title: "Suppression de boucle.",
        description:
          "La boucle sera supprimée du dépôt, avec son aller, son retour et le CER déposé.",
        color: "error",
      }).result;

      if (!ok) {
        return false;
      }

      const isOpen = session.file?.name === entry.file.name;
      const file = isOpen && session.file ? session.file : entry.file;
      const cer = isOpen ? session.cer : entry.cer;

      busy.remove = entry.file.name;

      try {
        await settings.repository.delete(file, `chore: remove ${file.name}`);

        if (cer) {
          await settings.repository.delete(cer, `chore: remove ${cer.name}`);
        }
      } finally {
        busy.remove = "";
      }

      if (isOpen) {
        await session.close();
      }

      return true;
    });

  const downloadCerTemplate = () =>
    attempt("Génération impossible.", async () => {
      const loop = session.loop;

      if (!loop) {
        return;
      }

      const { toDocx } = await import("#/documents/toDocx");
      const element = document.createElement("div");
      const app = createApp(CerDocument, { loop });

      app.mount(element);

      try {
        download(
          await toDocx(element, loop.title, "Compte rendu · CER"),
          `${loop.fileName("cer")}.docx`,
        );
      } finally {
        app.unmount();
      }
    });

  const uploadCerFile = (file: File) =>
    attempt("Dépôt du CER impossible.", async () => {
      await session.uploadCer(settings.repository, file);

      toast.add({
        title: "CER déposé avec succès.",
        color: "success",
        icon: "i-lucide-cloud-check",
      });
    });

  cerDialog.onChange((files) => {
    const file = files?.[0];

    if (file) {
      void uploadCerFile(file);
    }
  });

  const uploadCer = () => cerDialog.open();

  const downloadCer = () =>
    attempt("Téléchargement impossible.", async () => {
      if (session.loop && session.cer) {
        download(
          await settings.repository.read(session.cer),
          `${session.loop.fileName("cer")}.docx`,
        );
      }
    });

  const saveSettings = (data: SettingsData) =>
    attempt("Accès au dépôt impossible.", async () => {
      await new Repo(data.repo, data.token).check();
      await settings.save(data);

      toast.add({
        title: "Accès au dépôt vérifié avec succès.",
        color: "success",
        icon: "i-lucide-check",
      });

      return true;
    });

  async function close() {
    if (!(await canReplace())) {
      return;
    }

    await session.close();
    await router.push({ name: "home" });
  }

  return {
    create,
    importProsits,
    exportProsits,
    open,
    sync,
    remove,
    downloadCerTemplate,
    uploadCer,
    downloadCer,
    saveSettings,
    close,
  };
}
