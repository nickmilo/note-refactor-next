import {
  App,
  PluginSettingTab,
  SettingDefinitionItem
} from 'obsidian';
import { Location, NoteRefactorSettings } from './settings';
import MomentDateRegex from './moment-date-regex';
import NoteRefactor from './main';

type SettingKey = keyof NoteRefactorSettings;

export class NoteRefactorSettingsTab extends PluginSettingTab {
  folderUPop = createEl('b', { cls: 'u-pop' });
  filePrefixUPop = createEl('b', { cls: 'u-pop' });
  momentDateRegex = new MomentDateRegex();
  plugin: NoteRefactor;
  constructor(app: App, plugin: NoteRefactor) {
    super(app, plugin);
    this.plugin = plugin;
  }

  getSettingDefinitions(): SettingDefinitionItem[] {
    const settings = this.plugin.settings;
    return [
      {
        name: 'Default location for new notes',
        desc: 'Where newly created notes are placed.',
        control: {
          type: 'dropdown',
          key: 'newFileLocation',
          options: {
            [Location[Location.VaultFolder]]: 'Vault folder',
            [Location[Location.SameFolder]]: 'Same folder as current file',
            [Location[Location.SpecifiedFolder]]: 'In the folder specified below',
          },
        },
      },
      {
        name: 'Folder for new notes',
        desc: this.folderDescriptionContent(),
        visible: () => settings.newFileLocation == Location.SpecifiedFolder,
        control: { type: 'textarea', key: 'customFolder', placeholder: 'Example: folder 1/folder' },
      },
      {
        name: 'File name prefix',
        desc: this.filenamePrefixDescriptionContent(),
        control: { type: 'textarea', key: 'fileNamePrefix', placeholder: 'Example: {{date:YYYYMMDDHHmm}}-', rows: 2 },
      },
      {
        name: 'Transclude by default',
        desc: 'When content has been extracted/split into a new note, include a transclusion of the new note',
        control: { type: 'toggle', key: 'transcludeByDefault' },
      },
      {
        name: 'Note link template',
        desc: this.templateDescriptionContent('The template used to generate the link to the extracted note. This overrides the transclude by default setting.'),
        control: { type: 'textarea', key: 'noteLinkTemplate', placeholder: 'Example:\n\nSee also -> {{new_note_link}}', rows: 10 },
      },
      {
        name: 'Refactored note template',
        desc: this.templateDescriptionContent('The template used to generate the content for the refactored note.'),
        control: { type: 'textarea', key: 'refactoredNoteTemplate', placeholder: 'Example:\n\n{{new_note_content}}\n\n---\nLink to original note: {{link}}', rows: 10 },
      },
      {
        name: 'Exclude first line',
        desc: 'Prevent the first line of selected/split note content from being included in the new note (only applies for first line as file name commands)',
        control: { type: 'toggle', key: 'excludeFirstLineInNote' },
      },
      {
        name: 'Include heading',
        desc: 'Include first line of selected/split note content as note heading (applies for both first line as title and content only commands)',
        control: { type: 'toggle', key: 'includeFirstLineAsNoteHeading' },
      },
      {
        name: 'Open new note',
        desc: 'Open the new note in a new pane',
        control: { type: 'toggle', key: 'openNewNote' },
      },
      {
        name: 'Heading format',
        desc: 'Set format of the heading to be included in note content',
        visible: () => settings.includeFirstLineAsNoteHeading,
        control: { type: 'text', key: 'headingFormat', placeholder: '# or ##' },
      },
      {
        name: 'Normalize heading levels',
        desc: 'When content has been extracted/split into a new note, normalize the levels of the headings',
        control: { type: 'toggle', key: 'normalizeHeaderLevels' },
      },
    ];
  }

  getControlValue(key: string): unknown {
    if (key === 'newFileLocation') {
      return Location[this.plugin.settings.newFileLocation] ?? Location[Location.VaultFolder];
    }
    return this.plugin.settings[key as SettingKey] ?? '';
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    const settings = this.plugin.settings as unknown as Record<string, unknown>;
    if (key === 'newFileLocation') {
      settings[key] = Location[value as keyof typeof Location];
    } else {
      settings[key] = value;
    }
    await this.plugin.saveData(this.plugin.settings);
    this.updateFolderUPop();
    this.updateFileNamePrefixUPop();
    this.update();
  }

  private templateDescriptionContent(introText: string): DocumentFragment {
    const descEl = createFragment();
    descEl.appendText(introText);
    descEl.createEl('br');
    descEl.appendText('Supported placeholders:');
    descEl.createEl('br');
    descEl.appendText('{{date}} {{title}} {{link}} {{new_note_title}} {{new_note_link}} {{new_note_content}}');
    return descEl;
  }

  private folderDescriptionContent(): DocumentFragment {
    const descEl = createFragment();
    descEl.appendText('Newly created notes will appear under this folder.');
    descEl.createEl('br');
    this.dateFormattingDescription(descEl);
    descEl.appendText('Your current folder path syntax looks like this:');
    descEl.createEl('br');
    this.updateFolderUPop();
    descEl.appendChild(this.folderUPop);
    return descEl;
  }

  private updateFolderUPop() {
    this.folderUPop.setText(this.momentDateRegex.replace(this.plugin.settings.customFolder));
  }

  private filenamePrefixDescriptionContent(): DocumentFragment {
    const descEl = createFragment();
    descEl.appendText('Newly created notes will have this prefix');
    descEl.createEl('br');
    this.dateFormattingDescription(descEl);
    descEl.appendText('Your current file name prefix syntax looks like this:');
    descEl.createEl('br');
    this.updateFileNamePrefixUPop();
    descEl.appendChild(this.filePrefixUPop);
    return descEl;
  }

  private dateFormattingDescription(descEl: DocumentFragment) {
    descEl.appendText('Date formats are supported {{date:YYYYMMDDHHmm}}');
    descEl.createEl('br');
    descEl.appendText('and used with current date and time when note is created.');
    descEl.createEl('br');
    descEl.appendText('For more syntax, refer to ');
    descEl.createEl('a', {
      href: 'https://momentjs.com/docs/#/displaying/format/',
      text: 'format reference',
      attr: { target: '_blank' },
    });
    descEl.createEl('br');
  }

  private updateFileNamePrefixUPop() {
    this.filePrefixUPop.setText(this.momentDateRegex.replace(this.plugin.settings.fileNamePrefix));
  }
}
