var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => NoteRefactor
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");

// src/constants.ts
var HEADING_REGEX = /^[#\s-]*/;
var HEADING_FORMAT = "#";
var DEFAULT_DATE_FORMAT = "YYYYMMDDHHmm";
var DATE_REGEX = /(?<target>{{date:?(?<date>[^}]*)}})/g;
var FILE_NAME_REGEX = /[#*"\/\\<>:|\[\]\?]/gim;

// src/moment-date-regex.ts
var import_obsidian = require("obsidian");
var MomentDateRegex = class {
  replace(input) {
    const dateRegex = DATE_REGEX;
    const customFolderString = input;
    const matches = [];
    let match;
    while (match = dateRegex.exec(customFolderString)) {
      matches.push(match);
    }
    if (!matches || matches.length === 0) {
      return input;
    }
    const now = /* @__PURE__ */ new Date();
    const formattedDates = matches.map((m) => {
      var _a, _b, _c;
      const dateFormat = !((_a = m.groups) == null ? void 0 : _a.date) ? DEFAULT_DATE_FORMAT : m.groups.date;
      return [
        (_c = (_b = m.groups) == null ? void 0 : _b.target) != null ? _c : "",
        this.getMoment(now, dateFormat)
      ];
    });
    let output = customFolderString;
    formattedDates.forEach((fd) => {
      output = output.replace(fd[0], fd[1]);
    });
    return output;
  }
  getMoment(now, dateFormat) {
    return (0, import_obsidian.moment)(now).format(dateFormat);
  }
};

// src/settings-tab.ts
var import_obsidian2 = require("obsidian");

// src/settings.ts
var NoteRefactorSettings = class {
  constructor() {
    this.includeFirstLineAsNoteHeading = false;
    this.excludeFirstLineInNote = false;
    this.openNewNote = true;
    this.headingFormat = HEADING_FORMAT;
    this.newFileLocation = 0 /* VaultFolder */;
    this.customFolder = "";
    this.fileNamePrefix = "";
    this.transcludeByDefault = false;
    this.noteLinkTemplate = "";
    this.refactoredNoteTemplate = "";
    this.normalizeHeaderLevels = false;
  }
};
var Location = /* @__PURE__ */ ((Location2) => {
  Location2[Location2["VaultFolder"] = 0] = "VaultFolder";
  Location2[Location2["SameFolder"] = 1] = "SameFolder";
  Location2[Location2["SpecifiedFolder"] = 2] = "SpecifiedFolder";
  return Location2;
})(Location || {});

// src/settings-tab.ts
var NoteRefactorSettingsTab = class extends import_obsidian2.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.folderUPop = createEl("b", { cls: "u-pop" });
    this.filePrefixUPop = createEl("b", { cls: "u-pop" });
    this.momentDateRegex = new MomentDateRegex();
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian2.Setting(containerEl).setName("Default location for new notes").setDesc("Where newly created notes are placed.").addDropdown((dropDown) => dropDown.addOption(Location[0 /* VaultFolder */], "Vault folder").addOption(Location[1 /* SameFolder */], "Same folder as current file").addOption(Location[2 /* SpecifiedFolder */], "In the folder specified below").setValue(Location[this.plugin.settings.newFileLocation] || 0 /* VaultFolder */.toString()).onChange((value) => {
      this.plugin.settings.newFileLocation = Location[value];
      void this.plugin.saveData(this.plugin.settings);
      this.display();
    }));
    if (this.plugin.settings.newFileLocation == 2 /* SpecifiedFolder */) {
      new import_obsidian2.Setting(containerEl).setName("Folder for new notes").setDesc(this.folderDescriptionContent()).addTextArea((text) => text.setPlaceholder("Example: folder 1/folder").setValue(this.plugin.settings.customFolder).onChange((value) => {
        this.plugin.settings.customFolder = value;
        void this.plugin.saveData(this.plugin.settings);
        this.updateFolderUPop();
      }));
    }
    new import_obsidian2.Setting(containerEl).setName("File name prefix").setDesc(this.filenamePrefixDescriptionContent()).addTextArea((text) => {
      text.setPlaceholder("Example: {{date:YYYYMMDDHHmm}}-").setValue(this.plugin.settings.fileNamePrefix || "").onChange((value) => {
        this.plugin.settings.fileNamePrefix = value;
        void this.plugin.saveData(this.plugin.settings);
        this.updateFileNamePrefixUPop();
      });
      text.inputEl.rows = 2;
      text.inputEl.cols = 25;
    });
    new import_obsidian2.Setting(containerEl).setName("Transclude by default").setDesc("When content has been extracted/split into a new note, include a transclusion of the new note").addToggle((toggle) => toggle.setValue(this.plugin.settings.transcludeByDefault).onChange((value) => {
      this.plugin.settings.transcludeByDefault = value;
      void this.plugin.saveData(this.plugin.settings);
    }));
    new import_obsidian2.Setting(containerEl).setName("Note link template").setDesc(this.tempalteDescriptionContent("The template used to generate the link to the extracted note. This overrides the transclude by default setting.")).addTextArea((text) => {
      text.setPlaceholder("Example:\n\nSee also -> {{new_note_link}}").setValue(this.plugin.settings.noteLinkTemplate || "").onChange((value) => {
        this.plugin.settings.noteLinkTemplate = value;
        void this.plugin.saveData(this.plugin.settings);
        return text;
      });
      text.inputEl.rows = 10;
      text.inputEl.cols = 25;
    });
    new import_obsidian2.Setting(containerEl).setName("Refactored note template").setDesc(this.tempalteDescriptionContent("The template used to generate the content for the refactored note.")).addTextArea((text) => {
      text.setPlaceholder("Example:\n\n{{new_note_content}}\n\n---\nLink to original note: {{link}}").setValue(this.plugin.settings.refactoredNoteTemplate || "").onChange((value) => {
        this.plugin.settings.refactoredNoteTemplate = value;
        void this.plugin.saveData(this.plugin.settings);
        return text;
      });
      text.inputEl.rows = 10;
      text.inputEl.cols = 25;
    });
    new import_obsidian2.Setting(containerEl).setName("Exclude first line").setDesc("Prevent the first line of selected/split note content from being included in the new note (only applies for first line as file name commands)").addToggle((toggle) => toggle.setValue(this.plugin.settings.excludeFirstLineInNote).onChange((value) => {
      this.plugin.settings.excludeFirstLineInNote = value;
      void this.plugin.saveData(this.plugin.settings);
      this.display();
    }));
    new import_obsidian2.Setting(containerEl).setName("Include heading").setDesc("Include first line of selected/split note content as note heading (applies for both first line as title and content only commands)").addToggle((toggle) => toggle.setValue(this.plugin.settings.includeFirstLineAsNoteHeading).onChange((value) => {
      this.plugin.settings.includeFirstLineAsNoteHeading = value;
      void this.plugin.saveData(this.plugin.settings);
      this.display();
    }));
    new import_obsidian2.Setting(containerEl).setName("Open new note").setDesc("Open the new note in a new pane").addToggle((toggle) => toggle.setValue(this.plugin.settings.openNewNote).onChange((value) => {
      this.plugin.settings.openNewNote = value;
      void this.plugin.saveData(this.plugin.settings);
    }));
    if (this.plugin.settings.includeFirstLineAsNoteHeading) {
      new import_obsidian2.Setting(containerEl).setName("Heading format").setDesc("Set format of the heading to be included in note content").addText((text) => text.setPlaceholder("# or ##").setValue(this.plugin.settings.headingFormat).onChange((value) => {
        this.plugin.settings.headingFormat = value;
        void this.plugin.saveData(this.plugin.settings);
      }));
    }
    new import_obsidian2.Setting(containerEl).setName("Normalize heading levels").setDesc("When content has been extracted/split into a new note, normalize the levels of the headings").addToggle((toggle) => toggle.setValue(this.plugin.settings.normalizeHeaderLevels).onChange((value) => {
      this.plugin.settings.normalizeHeaderLevels = value;
      void this.plugin.saveData(this.plugin.settings);
    }));
  }
  tempalteDescriptionContent(introText) {
    const descEl = document.createDocumentFragment();
    descEl.appendText(introText);
    descEl.createEl("br");
    descEl.appendText("Supported placeholders:");
    descEl.createEl("br");
    descEl.appendText("{{date}} {{title}} {{link}} {{new_note_title}} {{new_note_link}} {{new_note_content}}");
    return descEl;
  }
  folderDescriptionContent() {
    const descEl = document.createDocumentFragment();
    descEl.appendText("Newly created notes will appear under this folder.");
    descEl.createEl("br");
    descEl.appendText("For more syntax, refer to ");
    this.dateFormattingDescription(descEl);
    descEl.appendText("Your current folder path syntax looks like this:");
    descEl.createEl("br");
    this.updateFolderUPop();
    descEl.appendChild(this.folderUPop);
    return descEl;
  }
  updateFolderUPop() {
    this.folderUPop.setText(this.momentDateRegex.replace(this.plugin.settings.customFolder));
  }
  filenamePrefixDescriptionContent() {
    const descEl = document.createDocumentFragment();
    descEl.appendText("Newly created notes will have this prefix");
    descEl.createEl("br");
    this.dateFormattingDescription(descEl);
    descEl.appendText("Your current file name prefix syntax looks like this:");
    descEl.createEl("br");
    this.updateFileNamePrefixUPop();
    descEl.appendChild(this.filePrefixUPop);
    return descEl;
  }
  dateFormattingDescription(descEl) {
    descEl.appendText("Date formats are supported {{date:YYYYMMDDHHmm}}");
    descEl.createEl("br");
    descEl.appendText("and used with current date and time when note is created.");
    descEl.createEl("br");
    descEl.appendText("For more syntax, refer to ");
    this.addMomentDocsLink(descEl);
  }
  updateFileNamePrefixUPop() {
    this.filePrefixUPop.setText(this.momentDateRegex.replace(this.plugin.settings.fileNamePrefix));
  }
  addMomentDocsLink(descEl) {
    descEl.createEl("a", {
      href: "https://momentjs.com/docs/#/displaying/format/",
      text: "format reference",
      attr: { target: "_blank" }
    });
    descEl.createEl("br");
  }
};

// src/file.ts
var NRFile = class {
  constructor(setting) {
    this.settings = setting;
    this.momentDateRegex = new MomentDateRegex();
  }
  sanitisedFileName(unsanitisedFilename) {
    const headerRegex = FILE_NAME_REGEX;
    const prefix = this.fileNamePrefix();
    const checkedPrefix = unsanitisedFilename.startsWith(prefix) ? "" : prefix;
    return checkedPrefix + unsanitisedFilename.replace(headerRegex, "").trim().slice(0, 255);
  }
  fileNamePrefix() {
    return this.settings.fileNamePrefix ? this.momentDateRegex.replace(this.settings.fileNamePrefix) : "";
  }
  ensureUniqueFileNames(headingNotes) {
    const fileNames = [];
    const deduped = headingNotes.map((hn) => {
      const fileName = this.sanitisedFileName(hn[0]);
      const duplicates = fileNames.filter((fn) => fn == fileName);
      fileNames.push(fileName);
      return duplicates.length >= 1 ? `${fileName}${duplicates.length + 1}` : fileName;
    });
    return deduped;
  }
};

// src/obsidian-file.ts
var import_obsidian3 = require("obsidian");
var ObsidianFile = class {
  constructor(setting, app) {
    this.settings = setting;
    this.app = app;
    this.vault = app.vault;
    this.file = new NRFile(this.settings);
    this.momentDateRegex = new MomentDateRegex();
  }
  filePath(view) {
    var _a, _b, _c;
    let path = "";
    switch (this.settings.newFileLocation) {
      case 0 /* VaultFolder */:
        path = this.vault.getRoot().path;
        break;
      case 1 /* SameFolder */:
        path = (_c = (_b = (_a = view == null ? void 0 : view.file) == null ? void 0 : _a.parent) == null ? void 0 : _b.path) != null ? _c : this.vault.getRoot().path;
        break;
      case 2 /* SpecifiedFolder */:
        path = this.momentDateRegex.replace(this.settings.customFolder);
        break;
    }
    return (0, import_obsidian3.normalizePath)(path);
  }
  filePathAndFileName(fileName, view) {
    return (0, import_obsidian3.normalizePath)(`${this.filePath(view)}/${fileName}.md`);
  }
  async createOrAppendFile(fileName, note) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian3.MarkdownView);
    const folderPath = this.filePath(view);
    const filePath = this.filePathAndFileName(fileName, view);
    const folderExists = this.vault.getAbstractFileByPath(folderPath) instanceof import_obsidian3.TFolder;
    if (!folderExists) {
      const folders = folderPath.split("/");
      try {
        await this.createFoldersFromVaultRoot("", folders);
      } catch (error) {
        console.error(error);
      }
    }
    try {
      const existing = this.vault.getAbstractFileByPath(filePath);
      if (existing instanceof import_obsidian3.TFile) {
        await this.appendFile(existing, note);
      } else {
        await this.vault.create(filePath, note);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }
  async appendFile(file, note) {
    await this.vault.process(file, (existingContent) => {
      if (existingContent.length > 0) {
        existingContent = existingContent + "\r\r";
      }
      return existingContent + note;
    });
  }
  async createFoldersFromVaultRoot(parentPath, folders) {
    if (folders.length === 0) {
      return;
    }
    const newFolderPath = (0, import_obsidian3.normalizePath)([parentPath, folders[0]].join("/"));
    const folderExists = this.vault.getAbstractFileByPath(newFolderPath) instanceof import_obsidian3.TFolder;
    folders.shift();
    if (folderExists) {
      await this.createFoldersFromVaultRoot(newFolderPath, folders);
    } else {
      await this.vault.createFolder(newFolderPath);
      await this.createFoldersFromVaultRoot(newFolderPath, folders);
    }
  }
};

// src/placeholder.ts
var NotePlaceholders = class {
  constructor() {
    this.newNoteTitle = new Placeholder("new_note_title");
    this.newNoteLink = new Placeholder("new_note_link");
    this.newNotePath = new Placeholder("new_note_path");
    this.newNotePathEncoded = new Placeholder("new_note_path_encoded");
    this.newNoteContent = new Placeholder("new_note_content");
    this.title = new Placeholder("title");
    this.link = new Placeholder("link");
  }
};
var Placeholder = class {
  constructor(key) {
    this.key = key;
  }
  replace(input, value) {
    return input.replace(new RegExp(`{{${this.key}}}`, "gmi"), () => value);
  }
};

// src/doc.ts
var NRDoc = class {
  constructor(settings, vault, fileManager) {
    this.settings = settings;
    this.vault = vault;
    this.fileManager = fileManager;
    this.templatePlaceholders = new NotePlaceholders();
    this.momentRegex = new MomentDateRegex();
  }
  removeNoteRemainder(doc, text) {
    const currentLine = doc.getCursor();
    const endPosition = doc.offsetToPos(doc.getValue().length);
    doc.replaceRange(text, currentLine, endPosition);
  }
  async replaceContent(fileName, filePath, doc, currentNote, content, originalContent, mode) {
    const transclude = this.settings.transcludeByDefault ? "!" : "";
    const link = await this.markdownLink(filePath);
    const currentNoteLink = await this.markdownLink(currentNote.path);
    let contentToInsert = transclude + link;
    contentToInsert = this.templatedContent(contentToInsert, this.settings.noteLinkTemplate, currentNote.basename, currentNoteLink, fileName, link, "", content);
    if (mode === "split") {
      this.removeNoteRemainder(doc, contentToInsert);
    } else if (mode === "replace-selection") {
      doc.replaceSelection(contentToInsert);
    } else if (mode === "replace-headings") {
      doc.setValue(doc.getValue().replace(originalContent, contentToInsert));
    }
  }
  async markdownLink(filePath) {
    const file = await this.vault.getMarkdownFiles().filter((f) => f.path === filePath)[0];
    const link = await this.fileManager.generateMarkdownLink(file, "", "", "");
    return link;
  }
  templatedContent(input, template, currentNoteTitle, currentNoteLink, newNoteTitle, newNoteLink, newNotePath, newNoteContent) {
    if (template === void 0 || template === "") {
      return input;
    }
    let output = template;
    output = this.momentRegex.replace(output);
    output = this.templatePlaceholders.title.replace(output, currentNoteTitle);
    output = this.templatePlaceholders.link.replace(output, currentNoteLink);
    output = this.templatePlaceholders.newNoteTitle.replace(output, newNoteTitle);
    output = this.templatePlaceholders.newNoteLink.replace(output, newNoteLink);
    output = this.templatePlaceholders.newNoteContent.replace(output, newNoteContent);
    output = this.templatePlaceholders.newNotePath.replace(output, newNotePath);
    return output;
  }
  selectedContent(doc) {
    const selectedText = doc.getSelection();
    const trimmedContent = selectedText.trim();
    return trimmedContent.split("\n");
  }
  noteRemainder(doc) {
    doc.setCursor(doc.getCursor().line, 0);
    const currentLine = doc.getCursor();
    const endPosition = doc.offsetToPos(doc.getValue().length);
    const content = doc.getRange(currentLine, endPosition);
    const trimmedContent = content.trim();
    return trimmedContent.split("\n");
  }
  contentSplitByHeading(doc, headingLevel) {
    const content = doc.getValue().split("\n");
    const parentHeading = new Array(headingLevel).join("#") + " ";
    const heading = new Array(headingLevel + 1).join("#") + " ";
    const matches = [];
    let headingMatch = [];
    content.forEach((line, i) => {
      if (line.startsWith(heading)) {
        if (headingMatch.length > 0) {
          matches.push(headingMatch);
          headingMatch = [];
          headingMatch.push(line);
        } else {
          headingMatch.push(line);
        }
      } else if (headingMatch.length > 0 && !line.startsWith(parentHeading)) {
        headingMatch.push(line);
      } else if (headingMatch.length > 0) {
        matches.push(headingMatch);
        headingMatch = [];
      }
      if (i === content.length - 1 && headingMatch.length > 0) {
        matches.push(headingMatch);
      }
    });
    return matches;
  }
  noteContent(firstLine, contentArr, contentOnly) {
    if (this.settings.includeFirstLineAsNoteHeading) {
      const headingBaseline = firstLine.replace(HEADING_REGEX, "");
      contentArr.unshift(`${this.settings.headingFormat} ${headingBaseline}`.trim());
    } else if (!this.settings.excludeFirstLineInNote || contentOnly) {
      contentArr.unshift(firstLine);
    }
    if (this.settings.normalizeHeaderLevels) {
      contentArr = this.normalizeHeadingLevels(contentArr);
    }
    return contentArr.join("\n").trim();
  }
  normalizeHeadingLevels(contentArr) {
    const minHeadingLevel = Math.min(...contentArr.map((line) => this.headingLevel(line)).filter((level) => level > 0));
    if (minHeadingLevel > 1) {
      contentArr.forEach((line, i) => {
        const level = this.headingLevel(line);
        if (level > 0) {
          contentArr[i] = line.substring(minHeadingLevel - 1);
        }
      });
    }
    return contentArr;
  }
  headingLevel(line) {
    let headingLevel = 0;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "#") {
        headingLevel++;
      } else if (line[i] === " ") {
        break;
      } else {
        headingLevel = 0;
        break;
      }
    }
    return headingLevel;
  }
};

// src/note-modal.ts
var import_obsidian4 = require("obsidian");
var EMPTY_TEXT = "No files found to append content. Enter to create a new one.";
var PLACEHOLDER_TEXT = "Type file to append to or create";
var instructions = [
  { command: "\u2191\u2193", purpose: "to navigate" },
  { command: "\u21B5", purpose: "to append content to file" },
  { command: "esc", purpose: "to dismiss" }
];
var NoteRefactorModal = class extends import_obsidian4.FuzzySuggestModal {
  constructor(app, modalNoteCreation) {
    super(app);
    this.modalNoteCreation = modalNoteCreation;
    this.init();
  }
  init() {
    this.files = this.app.vault.getMarkdownFiles();
    this.emptyStateText = EMPTY_TEXT;
    this.setPlaceholder(PLACEHOLDER_TEXT);
    this.setInstructions(instructions);
  }
  getItems() {
    const inputName = this.inputEl.value;
    if (inputName.length == 0 || this.files.filter((f) => this.isMatch(f.path, inputName + ".md")).length > 0) {
      return this.files;
    }
    const newFile = { basename: this.inputEl.value, path: void 0, stat: void 0, vault: void 0, extension: void 0, parent: void 0, name: void 0 };
    newFile.path = this.inputEl.value;
    return [newFile, ...this.files];
  }
  getItemText(item) {
    this.noSuggestion = false;
    return item.path;
  }
  onChooseItem(item, evt) {
    if (this.noSuggestion || item.vault == void 0) {
      void this.modalNoteCreation.create(this.inputEl.value);
    } else {
      void this.modalNoteCreation.append(item);
    }
  }
  renderSuggestion(item, el) {
    el.setText(item.item.path.replace(".md", ""));
    if (item.item.vault == void 0) {
      this.itemInstructionMessage(el, "Enter to create new file");
    }
  }
  itemInstructionMessage(resultEl, message) {
    resultEl.createEl("kbd", { cls: "suggestion-hotkey", text: message });
  }
  isMatch(input, match) {
    return input.toLocaleLowerCase() == match.toLocaleLowerCase();
  }
};

// src/modal-note-creation.ts
var import_obsidian5 = require("obsidian");
var ModalNoteCreation = class {
  constructor(app, settings, doc, file, obsFile, content, editor, mode) {
    this.app = app;
    this.settings = settings;
    this.content = content;
    this.doc = doc;
    this.obsFile = obsFile;
    this.file = file;
    this.editor = editor;
    this.mode = mode;
  }
  async create(fileName) {
    fileName = this.file.sanitisedFileName(fileName);
    const { currentFile } = this.getCurrentFile();
    if (!currentFile) {
      return;
    }
    const filePath = await this.obsFile.createOrAppendFile(fileName, "");
    if (!filePath) {
      return;
    }
    const templatedContent = await this.templatedContent(this.content, currentFile, filePath, fileName);
    await this.obsFile.createOrAppendFile(fileName, templatedContent);
    await this.doc.replaceContent(fileName, filePath, this.editor, currentFile, templatedContent, this.content, this.mode);
    if (this.settings.openNewNote) {
      await this.app.workspace.openLinkText(fileName, (0, import_obsidian5.getLinkpath)(filePath), true);
    }
  }
  async append(file, existingContent) {
    const { currentFile } = this.getCurrentFile();
    if (!currentFile) {
      return;
    }
    const templatedContent = await this.templatedContent(this.content, currentFile, file.path, file.basename);
    existingContent = existingContent != null ? existingContent : await this.app.vault.read(file) + "\r\r";
    await this.app.vault.modify(file, existingContent + templatedContent);
    await this.doc.replaceContent(file.basename, file.path, this.editor, currentFile, templatedContent, this.content, this.mode);
    if (this.settings.openNewNote) {
      await this.app.workspace.openLinkText(file.basename, (0, import_obsidian5.getLinkpath)(file.path), true);
    }
  }
  getCurrentFile() {
    var _a;
    const currentView = this.app.workspace.getActiveViewOfType(import_obsidian5.MarkdownView);
    const currentFile = (_a = currentView == null ? void 0 : currentView.file) != null ? _a : null;
    return { currentView, currentFile };
  }
  async templatedContent(note, curerntFile, filePath, fileName) {
    if (this.settings.refactoredNoteTemplate !== void 0 && this.settings.refactoredNoteTemplate !== "") {
      const currentFileLink = await this.doc.markdownLink(curerntFile.path);
      const fileLink = await this.doc.markdownLink(filePath);
      return this.doc.templatedContent(note, this.settings.refactoredNoteTemplate, curerntFile.basename, currentFileLink, fileName, fileLink, "", note);
    }
    return note;
  }
};

// src/main.ts
var NoteRefactor = class extends import_obsidian6.Plugin {
  async onload() {
    this.settings = Object.assign(new NoteRefactorSettings(), await this.loadData());
    this.momentDateRegex = new MomentDateRegex();
    this.obsFile = new ObsidianFile(this.settings, this.app);
    this.file = new NRFile(this.settings);
    this.NRDoc = new NRDoc(this.settings, this.app.vault, this.app.fileManager);
    this.addCommand({
      id: "app:extract-selection-first-line",
      name: "Extract selection to new note - first line as file name",
      callback: () => this.editModeGuard(async () => await this.extractSelectionFirstLine("replace-selection")),
      hotkeys: [
        {
          modifiers: ["Mod", "Shift"],
          key: "r"
        }
      ]
    });
    this.addCommand({
      id: "app:extract-selection-content-only",
      name: "Extract selection to new note - content only",
      callback: () => this.editModeGuard(() => this.extractSelectionContentOnly("replace-selection")),
      hotkeys: [
        {
          modifiers: ["Mod", "Shift"],
          key: "c"
        }
      ]
    });
    this.addCommand({
      id: "app:extract-selection-autogenerate-name",
      name: "Extract selection to new note - only prefix as file name",
      callback: () => this.editModeGuard(() => this.extractSelectionAutogenerate("replace-selection"))
    });
    this.addCommand({
      id: "app:split-note-first-line",
      name: "Split note here - first line as file name",
      callback: () => this.editModeGuard(() => this.extractSelectionFirstLine("split"))
    });
    this.addCommand({
      id: "app:split-note-content-only",
      name: "Split note here - content only",
      callback: () => this.editModeGuard(() => this.extractSelectionContentOnly("split"))
    });
    this.addCommand({
      id: "app:split-note-by-heading-h1",
      name: "Split note by headings - H1",
      callback: () => this.editModeGuard(() => this.splitOnHeading(1))
    });
    this.addCommand({
      id: "app:split-note-by-heading-h2",
      name: "Split note by headings - H2",
      callback: () => this.editModeGuard(() => this.splitOnHeading(2))
    });
    this.addCommand({
      id: "app:split-note-by-heading-h3",
      name: "Split note by headings - H3",
      callback: () => this.editModeGuard(() => this.splitOnHeading(3))
    });
    this.addSettingTab(new NoteRefactorSettingsTab(this.app, this));
  }
  editModeGuard(command) {
    const mdView = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    if (!mdView || mdView.getMode() !== "source") {
      new import_obsidian6.Notice("Please use Note Refactor Next in edit mode");
      return;
    } else {
      void command();
    }
  }
  async splitOnHeading(headingLevel) {
    const mdView = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    if (!mdView) {
      return;
    }
    const doc = mdView.editor;
    const headingNotes = this.NRDoc.contentSplitByHeading(doc, headingLevel);
    const dedupedFileNames = this.file.ensureUniqueFileNames(headingNotes);
    for (const [i, hn] of headingNotes.entries()) {
      await this.createNoteWithFirstLineAsFileName(dedupedFileNames[i], hn, mdView, doc, "replace-headings", true);
    }
  }
  async extractSelectionFirstLine(mode) {
    const mdView = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    if (!mdView) {
      return;
    }
    const doc = mdView.editor;
    const selectedContent = mode === "split" ? this.NRDoc.noteRemainder(doc) : this.NRDoc.selectedContent(doc);
    if (selectedContent.length <= 0) {
      return;
    }
    await this.createNoteWithFirstLineAsFileName(selectedContent[0], selectedContent, mdView, doc, mode, false);
  }
  async extractSelectionAutogenerate(mode) {
    const mdView = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    if (!mdView) {
      return;
    }
    const doc = mdView.editor;
    const selectedContent = mode === "split" ? this.NRDoc.noteRemainder(doc) : this.NRDoc.selectedContent(doc);
    if (selectedContent.length <= 0) {
      return;
    }
    await this.createAutogeneratedNote(selectedContent, mdView, doc, mode, true);
  }
  async createAutogeneratedNote(selectedContent, mdView, doc, mode, isMultiple) {
    const [header, ...contentArr] = selectedContent;
    const fileName = this.file.fileNamePrefix();
    const originalNote = this.NRDoc.noteContent(header, contentArr);
    let note = originalNote;
    const filePath = await this.obsFile.createOrAppendFile(fileName, "");
    if (!filePath || !mdView.file) {
      return;
    }
    if (this.settings.refactoredNoteTemplate !== void 0 && this.settings.refactoredNoteTemplate !== "") {
      const link = await this.app.fileManager.generateMarkdownLink(mdView.file, "", "", "");
      const newNoteLink = await this.NRDoc.markdownLink(filePath);
      note = this.NRDoc.templatedContent(note, this.settings.refactoredNoteTemplate, mdView.file.basename, link, fileName, newNoteLink, "", note);
    }
    await this.obsFile.createOrAppendFile(fileName, note);
    await this.NRDoc.replaceContent(fileName, filePath, doc, mdView.file, note, originalNote, mode);
    if (!isMultiple) {
      await this.app.workspace.openLinkText(fileName, (0, import_obsidian6.getLinkpath)(filePath), true);
    }
  }
  async createNoteWithFirstLineAsFileName(dedupedHeader, selectedContent, mdView, doc, mode, isMultiple) {
    const [originalHeader, ...contentArr] = selectedContent;
    const fileName = this.file.sanitisedFileName(dedupedHeader);
    const originalNote = this.NRDoc.noteContent(originalHeader, contentArr);
    let note = originalNote;
    const filePath = await this.obsFile.createOrAppendFile(fileName, "");
    if (!filePath || !mdView.file) {
      return;
    }
    if (this.settings.refactoredNoteTemplate !== void 0 && this.settings.refactoredNoteTemplate !== "") {
      const link = await this.app.fileManager.generateMarkdownLink(mdView.file, "", "", "");
      const newNoteLink = await this.NRDoc.markdownLink(filePath);
      note = this.NRDoc.templatedContent(note, this.settings.refactoredNoteTemplate, mdView.file.basename, link, fileName, newNoteLink, "", note);
    }
    await this.obsFile.createOrAppendFile(fileName, note);
    await this.NRDoc.replaceContent(fileName, filePath, doc, mdView.file, note, originalNote, mode);
    if (!isMultiple && this.settings.openNewNote) {
      await this.app.workspace.openLinkText(fileName, (0, import_obsidian6.getLinkpath)(filePath), true);
    }
  }
  extractSelectionContentOnly(mode) {
    const mdView = this.app.workspace.getActiveViewOfType(import_obsidian6.MarkdownView);
    if (!mdView) {
      return;
    }
    const doc = mdView.editor;
    const contentArr = mode === "split" ? this.NRDoc.noteRemainder(doc) : this.NRDoc.selectedContent(doc);
    if (contentArr.length <= 0) {
      return;
    }
    this.loadModal(contentArr, doc, mode);
  }
  loadModal(contentArr, doc, mode) {
    let note = this.NRDoc.noteContent(contentArr[0], contentArr.slice(1), true);
    const modalCreation = new ModalNoteCreation(this.app, this.settings, this.NRDoc, this.file, this.obsFile, note, doc, mode);
    new NoteRefactorModal(this.app, modalCreation).open();
  }
};
