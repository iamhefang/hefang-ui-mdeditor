import * as React from "react";
import {render} from "react-dom";
import {MarkdownEditor} from "./src/MarkdownEditor";
import {config} from "ace-builds";

config.set("basePath", "//api.jueweikeji.com.cn/statics/ace/1.4.3/src/");

render(<MarkdownEditor onChange={console.log}/>, document.body);