<picture>
  <source srcset="./public/logo-dark.png" media="(prefers-color-scheme: dark)">
  <img src="./public/logo.png" alt="Cerise" width="96">
</picture>

# Cerise

> An editor for CESI loops: outbound prosit, return prosit and CER.

## How it works

- The scribe creates a loop, fills in the outbound prosit, later the return prosit, and exports a `.prosits` file for the group.
- Each student imports the `.prosits`, downloads a CER template (`.docx`) prefilled from the outbound prosit, fills it in Word and uploads it next to the loop.
- Each loop is saved as a JSON file in the student's own private GitHub repo, using a fine-grained token.

## Documents

The outbound and return prosits print to PDF from the browser; the CER template is a Word file. Both come from the components in `src/documents/`, and share their look through `src/documents/theme.ts`.
