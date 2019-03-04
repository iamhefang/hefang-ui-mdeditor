import * as React from "react";
import {render} from "react-dom";
import {MarkdownEditor} from "./src/MarkdownEditor";


render(<MarkdownEditor onChange={console.log}/>, document.body);