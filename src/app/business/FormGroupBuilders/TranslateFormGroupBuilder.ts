import {FormBuilder, FormGroup} from '@angular/forms';
import {ITranslate} from '../interfaces/ITranslate';

export class TranslateFormGroupBuilder {
    constructor() {

    }

    buildGroup(translate: ITranslate): FormGroup {
        return new FormBuilder().group({
            en: [translate.en],
            heb: [translate.heb]
        });
    }
}