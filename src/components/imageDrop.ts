import { type Editor, Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

const MAX_SIZE = 1600;

async function imageSrc(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIZE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");

  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/webp", 0.85);
}

export async function insertImages(
  editor: Editor,
  files: File[],
  pos?: number,
) {
  for (const file of files) {
    const content = { type: "image", attrs: { src: await imageSrc(file) } };

    if (pos === undefined) {
      editor.chain().focus().insertContent(content).run();
    } else {
      editor.chain().insertContentAt(pos, content).run();
    }
  }
}

const imageFiles = (data: DataTransfer | null) => {
  return [...(data?.files ?? [])].filter((f) => f.type.startsWith("image/"));
};

export const ImageDrop = Extension.create({
  name: "imageDrop",

  addProseMirrorPlugins() {
    const editor = this.editor;

    return [
      new Plugin({
        props: {
          handlePaste(_view, event) {
            const files = imageFiles(event.clipboardData);
            if (!files.length) {
              return false;
            }

            void insertImages(editor, files);

            return true;
          },
          handleDrop(view, event) {
            const files = imageFiles(event.dataTransfer);
            if (!files.length) {
              return false;
            }

            event.preventDefault();

            const pos = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            })?.pos;

            void insertImages(editor, files, pos);

            return true;
          },
        },
      }),
    ];
  },
});
