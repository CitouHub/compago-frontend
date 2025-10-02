export interface DialogContextType {
    openDialog: (dialogType: DialogType, title: string, text: AdditionalText[]) => Promise<boolean>;
};

export interface AdditionalText {
    text: string,
    textType: TextType
}

export enum DialogType {
    INFORMATION = 1,
    CONFIRM = 2
}

export enum TextType {
    INFORMATION = 1,
    WARNING = 2
}

export function informationText(text: string): AdditionalText {
    return { text: text, textType: TextType.INFORMATION } as AdditionalText
}

export function warningText(text: string): AdditionalText {
    return { text: text, textType: TextType.WARNING } as AdditionalText
}