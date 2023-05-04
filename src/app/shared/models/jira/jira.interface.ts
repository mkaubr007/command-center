export interface IJiraAllowedValues {
    avatarId?: number;
    description?: string;
    iconUrl?: string;
    id?: string;
    name?: string;
    self?: string;
    value?: string;
    subtask?: boolean; 
}

export interface IJiraUser {
    accountId: string;
    accountType: string;
    active: boolean;
    avatarUrLs?: any;
    displayName: string;
    emailAddress: string;
    locale: string;
    self: string;
    timeZone: string;
}

export interface IJiraFieldSchema {
    item?: string;
    items?: string;
    type?: string;
    system?: string;
    custom?: string;
    customId?: number;
}

export interface IJiraDefaultValue {
    iconURL?: string;
    id?: string;
    name?: string;
    self?: string;
}

export interface IJiraField {
    allowedValues?: IJiraAllowedValues[];
    hasDefaultValue?: boolean;
    defaultValue?: IJiraDefaultValue;
    key?: string;
    name?: string;
    operations?: string[];
    required?: boolean;
    schema?: IJiraFieldSchema;
}

export interface IJiraIssueType {
    description: string;
    expand?: string;
    fields?: IJiraField | any;
    iconUrl?: string;
    id?: string;
    name?: string;
    self?: string;
    subtask?: boolean;
    untranslatedName?: string;
}