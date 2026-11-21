import {
  BorderStyle,
  Document,
  HeadingLevel,
  type IBorderOptions,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

import { theme } from "#/documents/theme";

const page = { width: 11906, height: 16838, margin: 1134 };
const textWidth = page.width - 2 * page.margin;

const line = (color: string, size = 4): IBorderOptions => ({
  style: BorderStyle.SINGLE,
  size,
  color,
  space: 0,
});

const styles = {
  default: {
    document: {
      run: { font: theme.font, size: 22, color: theme.text },
      paragraph: { spacing: { after: 80, line: 276 } },
    },
    title: {
      run: { font: theme.font, size: 48, bold: true, color: theme.text },
      paragraph: {
        spacing: { after: 360 },
        border: { bottom: { ...line(theme.accent, 24), space: 8 } },
      },
    },
    heading1: {
      run: { font: theme.font, size: 32, bold: true, color: theme.text },
      paragraph: {
        spacing: { before: 480, after: 200 },
        indent: { left: 180 },
        border: { left: { ...line(theme.accent, 36), space: 8 } },
        keepNext: true,
      },
    },
    heading2: {
      run: { font: theme.font, size: 24, bold: true, color: theme.text },
      paragraph: { spacing: { before: 280, after: 120 }, keepNext: true },
    },
  },
  paragraphStyles: [
    {
      id: "Kicker",
      name: "Kicker",
      basedOn: "Normal",
      next: "Normal",
      quickFormat: true,
      run: {
        size: 18,
        bold: true,
        allCaps: true,
        characterSpacing: 20,
        color: theme.accentDark,
      },
      paragraph: { spacing: { after: 40 }, keepNext: true },
    },
  ],
  characterStyles: [
    {
      id: "Placeholder",
      name: "Placeholder",
      quickFormat: true,
      run: { italics: true, color: theme.muted },
    },
  ],
};

interface Format {
  bold?: boolean;
  style?: string;
}

function runs(node: Node, format: Format = {}): TextRun[] {
  if (node instanceof Text) {
    const text = node.data.replace(/\s+/g, " ");

    return text.trim() ? [new TextRun({ text, ...format })] : [];
  }

  if (!(node instanceof HTMLElement)) {
    return [];
  }

  if (node.tagName === "BR") {
    return [new TextRun({ break: 1 })];
  }

  const inner: Format = {
    ...format,
    ...(node.tagName === "STRONG" && { bold: true }),
    ...(node.classList.contains("placeholder") && { style: "Placeholder" }),
  };

  return [...node.childNodes].flatMap((child) => runs(child, inner));
}

const paragraph = (node: Node, format?: Format) =>
  new Paragraph({ children: runs(node, format) });

function cell(node: HTMLTableCellElement, width: number, header: boolean) {
  const label =
    node.tagName === "TH" &&
    node.closest("table")?.classList.contains("fields");
  const fill = header || label ? theme.accent : undefined;

  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    shading: fill
      ? { type: ShadingType.CLEAR, color: "auto", fill }
      : undefined,
    children: [paragraph(node, { bold: node.tagName === "TH" })],
  });
}

function table(node: HTMLTableElement) {
  const widths = [...node.querySelectorAll("col")].map((col) =>
    Math.round((parseFloat(col.style.width) / 100) * textWidth),
  );

  return new Table({
    width: { size: textWidth, type: WidthType.DXA },
    columnWidths: widths,
    layout: TableLayoutType.FIXED,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    borders: {
      top: line(theme.border),
      bottom: line(theme.border),
      left: line(theme.border),
      right: line(theme.border),
      insideHorizontal: line(theme.border),
      insideVertical: line(theme.border),
    },
    rows: [...node.rows].map((row) => {
      const header = row.parentElement?.tagName === "THEAD";

      return new TableRow({
        tableHeader: header,
        cantSplit: true,
        children: [...row.cells].map((c, i) => cell(c, widths[i] ?? 0, header)),
      });
    }),
  });
}

function blocks(node: Element): (Paragraph | Table)[] {
  return [...node.children].flatMap((child) => {
    switch (child.tagName) {
      case "H1":
        return [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: runs(child),
          }),
        ];
      case "H2":
        return [
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: runs(child),
          }),
        ];
      case "P":
        return [paragraph(child)];
      case "UL":
        return [...child.children].map(
          (item) =>
            new Paragraph({ bullet: { level: 0 }, children: runs(item) }),
        );
      case "TABLE":
        return [table(child as HTMLTableElement), new Paragraph({})];
      default:
        return blocks(child);
    }
  });
}

export function toDocx(element: Element, title: string, label: string) {
  return Packer.toBlob(
    new Document({
      styles,
      sections: [
        {
          properties: {
            page: {
              size: { width: page.width, height: page.height },
              margin: {
                top: page.margin,
                right: page.margin,
                bottom: page.margin,
                left: page.margin,
              },
            },
          },
          children: [
            new Paragraph({ style: "Kicker", text: label }),
            new Paragraph({ heading: HeadingLevel.TITLE, text: title }),
            ...blocks(element),
          ],
        },
      ],
    }),
  );
}
