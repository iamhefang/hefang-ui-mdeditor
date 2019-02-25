import {MarkdownEditor} from "../index";
import {Ace} from "ace-builds";

export type ToolBarAction = (editor?: MarkdownEditor, ace?: Ace.Editor) => void