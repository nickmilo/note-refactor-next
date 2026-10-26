import { HEADING_FORMAT } from './constants';

export class NoteRefactorSettings {
    includeFirstLineAsNoteHeading: boolean = false;
    excludeFirstLineInNote: boolean = true;
    openNewNote: boolean = true;
    headingFormat: string = HEADING_FORMAT;
    newFileLocation: Location = Location.SameFolder;
    customFolder: string = '';
    fileNamePrefix: string = '';
    transcludeByDefault: boolean = false;
    noteLinkTemplate: string = '';
    refactoredNoteTemplate: string = '---\nup: []\nrelated: []\ncreated: "{{date:YYYY-MM-DD}}"\n---\n\n{{new_note_content}}';
    normalizeHeaderLevels: boolean = false;
  }
  
export enum Location {
    VaultFolder,
    SameFolder,
    SpecifiedFolder
}