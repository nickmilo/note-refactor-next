import { App, FuzzyMatch, FuzzySuggestModal, TFile } from 'obsidian';
import ModalNoteCreation from './modal-note-creation';
const EMPTY_TEXT = 'No files found to append content. Enter to create a new one.'
const PLACEHOLDER_TEXT = 'Type file to append to or create';
interface NewNoteItem {
    path: string;
    isNew: true;
}
type RefactorTarget = TFile | NewNoteItem;

const instructions = [
    {command: '↑↓', purpose: 'to navigate'},
    {command: '↵', purpose: 'to append content to file'},
    {command: 'esc', purpose: 'to dismiss'}
];

export default class NoteRefactorModal extends FuzzySuggestModal<RefactorTarget>{
    modalNoteCreation: ModalNoteCreation;
    files: TFile[] = [];
    noSuggestion = false;

    constructor(app: App, modalNoteCreation: ModalNoteCreation) {
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

    getItems(): RefactorTarget[] {
        const inputName = this.inputEl.value;
        if(inputName.length == 0 || this.files.filter(f => this.isMatch(f.path, inputName + '.md')).length > 0){
            return this.files;
        }
        const newFile: NewNoteItem = { path: this.inputEl.value, isNew: true };
        return [newFile, ...this.files];
    }
    
    getItemText(item: RefactorTarget): string {
        this.noSuggestion = false;
        return item.path;
    }
    
    onChooseItem(item: RefactorTarget): void {
        if(this.noSuggestion || !(item instanceof TFile)) {
            void this.modalNoteCreation.create(this.inputEl.value);
        } else {
            void this.modalNoteCreation.append(item);
        }
    }

    renderSuggestion(item: FuzzyMatch<RefactorTarget>, el: HTMLElement) {
        el.setText(item.item.path.replace('.md', ''));
        if(!(item.item instanceof TFile)) {
            this.itemInstructionMessage(el, 'Enter to create new file');
        }
    }

    itemInstructionMessage(resultEl: HTMLElement, message: string) {
        resultEl.createEl('kbd', { cls: 'suggestion-hotkey', text: message });
    }

    isMatch(input: string, match: string){
        return input.toLocaleLowerCase() == match.toLocaleLowerCase()
    }
    
}