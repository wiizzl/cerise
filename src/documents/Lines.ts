import { Fragment, h } from "vue";

export default function Lines({ text }: { text: string }) {
  return h(
    Fragment,
    text
      .trim()
      .split("\n")
      .flatMap((line, index) => (index ? [h("br"), line] : [line])),
  );
}
