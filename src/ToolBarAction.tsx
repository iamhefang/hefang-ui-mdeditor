import {Ace} from "ace-builds";
import {MarkdownEditor} from "./MarkdownEditor";


export type ToolBarAction = (editor?: MarkdownEditor, ace?: Ace.Editor) => void