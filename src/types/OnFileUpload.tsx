import {MarkdownEditor} from "../MarkdownEditor";

export type OnFileUpload = (files: FileList, editor: MarkdownEditor, callback?: (url: string) => void) => boolean | void;