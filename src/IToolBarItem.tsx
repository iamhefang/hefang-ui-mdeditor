import {ToolBarAction} from "./ToolBarAction";
import {ReactNode} from "react";
import {MarkdownEditor} from "../index";

export interface IToolBarItem {
    id: string
    name: string | ((editor: MarkdownEditor) => void)
    icon: ReactNode | ((editor: MarkdownEditor) => void)
    action: ToolBarAction
}