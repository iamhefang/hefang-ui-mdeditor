import * as React from "react";
import {render} from "react-dom";
import {MarkdownEditor} from "./src/MarkdownEditor";
import {config} from "ace-builds";
import {IToolBarItem} from "./src/IToolBarItem";
import {guid, repeat} from "hefang-js";

config.set("basePath", "//api.jueweikeji.com.cn/statics/ace/1.4.3/src/");

const tools: IToolBarItem[] = [
    {
        id: 'test',
        icon: 'cog',
        name: 'test',
        action: (editor, ace) => {
            console.log(ace.getSession().getScreenLength());
        }
    }
];

render(<MarkdownEditor enableUpload={true}
                       value={repeat(guid(), 20)}
                       onFileUpload={(files, editor, callback) => {
                           const file = files.item(0)
                               , data = new Blob([file])
                               , dataUrl = URL.createObjectURL(data);
                           callback(dataUrl)
                       }}/>, document.body);