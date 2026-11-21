<script setup lang="ts">
import type {
  EditorCustomHandlers,
  EditorProps,
  EditorToolbarItem,
} from "@nuxt/ui";
import type { Editor } from "@tiptap/vue-3";
import { useFileDialog } from "@vueuse/core";
import { computed } from "vue";

import { ImageDrop, insertImages } from "#/components/imageDrop";

import type { RichDoc } from "#/lib/schema";

const value = defineModel<RichDoc>();

const content = computed(() => value.value as EditorProps["modelValue"]);

let target: Editor | undefined;

const imageDialog = useFileDialog({ accept: "image/*", reset: true });

imageDialog.onChange((files) => {
  if (target && files) {
    void insertImages(target, [...files]);
  }
});

const handlers = {
  imageUpload: {
    canExecute: () => true,
    isActive: (editor: Editor) => editor.isActive("image"),
    execute: (editor: Editor) => {
      target = editor;
      imageDialog.open();

      return editor.chain();
    },
  },
} satisfies EditorCustomHandlers;

const toolbar = [
  [
    { kind: "undo", icon: "i-lucide-undo", "aria-label": "Annuler" },
    { kind: "redo", icon: "i-lucide-redo", "aria-label": "Rétablir" },
  ],
  [
    {
      icon: "i-lucide-heading",
      "aria-label": "Titres",
      content: { align: "start" },
      items: [
        {
          kind: "heading",
          level: 1,
          icon: "i-lucide-heading-1",
          label: "Titre 1",
        },
        {
          kind: "heading",
          level: 2,
          icon: "i-lucide-heading-2",
          label: "Titre 2",
        },
        {
          kind: "heading",
          level: 3,
          icon: "i-lucide-heading-3",
          label: "Titre 3",
        },
      ],
    },
    {
      icon: "i-lucide-list",
      "aria-label": "Listes",
      content: { align: "start" },
      items: [
        { kind: "bulletList", icon: "i-lucide-list", label: "Liste à puces" },
        {
          kind: "orderedList",
          icon: "i-lucide-list-ordered",
          label: "Liste numérotée",
        },
      ],
    },
    {
      kind: "blockquote",
      icon: "i-lucide-text-quote",
      "aria-label": "Citation",
    },
    {
      kind: "codeBlock",
      icon: "i-lucide-square-code",
      "aria-label": "Bloc de code",
    },
  ],
  [
    { kind: "mark", mark: "bold", icon: "i-lucide-bold", "aria-label": "Gras" },
    {
      kind: "mark",
      mark: "italic",
      icon: "i-lucide-italic",
      "aria-label": "Italique",
    },
    {
      kind: "mark",
      mark: "underline",
      icon: "i-lucide-underline",
      "aria-label": "Souligné",
    },
    {
      kind: "mark",
      mark: "strike",
      icon: "i-lucide-strikethrough",
      "aria-label": "Barré",
    },
    { kind: "mark", mark: "code", icon: "i-lucide-code", "aria-label": "Code" },
  ],
  [{ kind: "imageUpload", icon: "i-lucide-image", "aria-label": "Image" }],
] satisfies EditorToolbarItem<typeof handlers>[][];
</script>

<template>
  <div class="rounded-lg border border-default">
    <UEditor
      v-slot="{ editor }"
      :model-value="content"
      content-type="json"
      :image="{ allowBase64: true }"
      :mention="false"
      :starter-kit="{ link: false }"
      :extensions="[ImageDrop]"
      :handlers="handlers"
      :ui="{ base: 'min-h-40 px-4 py-4 sm:px-6' }"
      class="w-full"
      @update:model-value="value = $event as RichDoc"
    >
      <UEditorToolbar
        :editor="editor"
        :items="toolbar"
        class="sticky inset-x-0 top-14 z-10 overflow-x-auto rounded-t-lg border-b border-muted bg-default px-2 py-1.5 sm:px-4"
      />
    </UEditor>
  </div>
</template>
