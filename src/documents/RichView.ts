import { type PropType, type VNodeChild, defineComponent, h } from "vue";

import type { RichDoc } from "#/lib/schema";

interface JsonNode {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: { type?: string; attrs?: Record<string, unknown> }[];
  content?: JsonNode[];
}

const blockTags: Record<string, string> = {
  paragraph: "p",
  bulletList: "ul",
  orderedList: "ol",
  listItem: "li",
  blockquote: "blockquote",
  horizontalRule: "hr",
  hardBreak: "br",
};

const markTags: Record<string, string> = {
  bold: "strong",
  italic: "em",
  underline: "u",
  strike: "s",
  code: "code",
};

function renderText(node: JsonNode): VNodeChild {
  let out: VNodeChild = node.text ?? "";

  for (const mark of node.marks ?? []) {
    if (mark.type === "link") {
      out = h("a", { href: mark.attrs?.href }, [out]);
    } else if (mark.type && markTags[mark.type]) {
      out = h(markTags[mark.type] as string, [out]);
    }
  }

  return out;
}

function render(node: JsonNode): VNodeChild {
  const children = () => (node.content ?? []).map(render);

  switch (node.type) {
    case "text":
      return renderText(node);
    case "heading": {
      const level = Math.min((Number(node.attrs?.level) || 1) + 2, 6);
      return h(`h${level}`, children());
    }
    case "codeBlock":
      return h("pre", [h("code", children())]);
    case "orderedList":
      return h("ol", { start: node.attrs?.start }, children());
    case "image":
      return h("figure", [h("img", { src: node.attrs?.src, alt: "" })]);
    default:
      return h(blockTags[node.type ?? ""] ?? "div", children());
  }
}

export default defineComponent({
  name: "RichView",
  props: {
    doc: { type: Object as PropType<RichDoc | undefined>, default: undefined },
  },
  setup(props) {
    return () =>
      h("div", ((props.doc?.content ?? []) as JsonNode[]).map(render));
  },
});
