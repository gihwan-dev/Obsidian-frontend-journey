/*
Bulk re-export Excalidraw files to SVG (and .dark.svg if enabled).

Why
- Excalidraw plugin's auto-export is save-event based. Changing `embedType`,
  `autoExportLightAndDark`, or similar settings does NOT retroactively export
  existing `.excalidraw.md` files.
- This script re-opens each drawing file and calls the plugin's save(),
  which runs the auto-export pipeline.
- After running, every drawing should have matching `.svg` (and `.dark.svg`
  if `autoExportLightAndDark=true`) siblings in the same folder.

Prerequisite plugin settings (Settings → Excalidraw)
- Embed Type = SVG
- Auto-export SVG = true
- Auto-export light and dark SVG = true

Usage
1. Command Palette → "Excalidraw: Execute Excalidraw script".
2. Pick this file.
3. Wait. Notices show progress.

Safe to run multiple times. Re-exports identical content.
*/

(async () => {
  const files = app.vault
    .getFiles()
    .filter((f) => f.name.endsWith(".excalidraw.md"));

  if (files.length === 0) {
    new Notice("No .excalidraw.md files found in vault.");
    return;
  }

  const eta = Math.ceil(files.length * 0.8);
  new Notice(
    `Re-exporting ${files.length} drawings (~${eta}s). Keep Obsidian focused.`,
    5000
  );

  const startLeaf = app.workspace.activeLeaf;
  let ok = 0;
  let fail = 0;
  const failed = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const leaf = app.workspace.getLeaf(false);
      await leaf.openFile(file, { active: false });
      await new Promise((r) => setTimeout(r, 700));

      const view = leaf.view;
      if (view && view.getViewType && view.getViewType() === "excalidraw") {
        if (typeof view.save === "function") {
          await view.save(true);
        }
      }
      ok++;

      if ((i + 1) % 5 === 0 || i === files.length - 1) {
        new Notice(`Progress: ${i + 1}/${files.length}`, 2000);
      }
    } catch (e) {
      console.error("Re-export failed for", file.path, e);
      failed.push(file.path);
      fail++;
    }
  }

  if (startLeaf) app.workspace.setActiveLeaf(startLeaf);

  new Notice(`Done. Re-exported: ${ok}. Failed: ${fail}.`, 8000);
  console.log(`Bulk re-export summary — ok=${ok} fail=${fail}`);
  if (failed.length) console.log("Failed paths:", failed);
})();
