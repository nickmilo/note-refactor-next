# Note Refactor Next

Extract selected text into new notes, and split notes, in [Obsidian](https://obsidian.md).

This is a continuation of **[Note Refactor](https://github.com/lynchjames/note-refactor-obsidian) by James Lynch**. All of the design and nearly all of the code is his. The original stopped receiving updates in 2023, and this version exists only to keep it working on current versions of Obsidian. Behavior and settings are the same.

## What changed from Note Refactor 1.8.2

- Uses `getActiveViewOfType(MarkdownView)` in place of the deprecated `workspace.activeLeaf`.
- Uses Obsidian's `Notice` for the "use edit mode" message (the original called the browser's `Notification` API).
- Uses Obsidian's bundled `moment` instead of shipping its own copy.
- Complete manifest (`author`, `minAppVersion`).
- Uses Obsidian's Vault API (`getAbstractFileByPath`, `Vault.process`) instead of raw adapter reads and writes.
- Awaits file operations in order, including when splitting a note by headings.
- Builds settings and suggestion elements with Obsidian's `createEl` helpers; settings names are in sentence case.
- Settings use Obsidian's declarative settings API, so they show up in Obsidian's settings search. Requires Obsidian 1.13 or later.
- Default hotkey for **Extract selection to new note - first line as file name** is `Cmd/Ctrl + Shift + R`. No other command has a default hotkey; set your own under Settings → Hotkeys.

## Commands

- Extract selection to new note - first line as file name (`Cmd/Ctrl + Shift + R`)
- Extract selection to new note - content only
- Extract selection to new note - only prefix as file name
- Split note here - first line as file name
- Split note here - content only
- Split note by headings - H1, H2, H3

For full documentation of settings and templates, see the [original README](https://github.com/lynchjames/note-refactor-obsidian#readme).

## Credit

Created by James Lynch ([@lynchjames](https://github.com/lynchjames)). MIT licensed; the original copyright notice is kept in `LICENSE`.
