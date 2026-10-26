# Contributing to Note Refactor Next

Thanks for helping out. This plugin is a continuation of [Note Refactor](https://github.com/lynchjames/note-refactor-obsidian) by James Lynch, and the goal is to keep it working the way it always has.

## Reporting a problem

Open an issue with:

- What you did, what you expected, and what happened
- Your Obsidian version and platform (desktop or mobile)
- Your Note Refactor Next settings, especially any templates
- Any errors from the developer console (View → Toggle Developer Tools → Console)

## Suggesting a change

Open an issue first to talk it through. Pull requests are welcome after that. New features are less likely to be accepted than fixes, since the aim is to preserve the original behavior.

## Development

```
npm install
npm run dev     # rebuilds main.js on change
npm run build   # type-checks and builds a production main.js
```

Copy `main.js`, `manifest.json` and `styles.css` into `.obsidian/plugins/note-refactor-next/` in a test vault. `main.js` is not committed; releases are built by GitHub Actions when the version in `manifest.json` changes.

Please follow Obsidian's [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines) and run Obsidian's [ESLint plugin](https://github.com/obsidianmd/eslint-plugin) before opening a pull request.

## License

By contributing, you agree that your contributions are licensed under MIT, the same license as the plugin.
