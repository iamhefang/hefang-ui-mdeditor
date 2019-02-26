import * as React from "react";
import {render} from "react-dom";
import {MarkdownEditor} from "./src/MarkdownEditor";

let md, hl;
render(<>
    <div style={{height: 500}}>
        <MarkdownEditor defaultValue={'# hefang-ui-mdeditor\n' +
        '\n' +
        '1. 基于hefang-ui开发\n' +
        '1. MIT协议\n' +
        '1. 免费开源\n' +
        '\n' +
        '## 使用方法\n' +
        '\n' +
        '### 如何安装\n' +
        '\n' +
        '`npm i hefang-ui-mdeditor`\n' +
        '\n' +
        '> 还未上传到npmjs，暂时无法使用上面的命令安装\n' +
        '\n' +
        '### 在代码中\n' +
        '\n' +
        '```jsx\n' +
        '<MarkdownEditor defaultValue=\'# h1\' onChange={(html, markdown) => {\n' +
        '    \n' +
        '}}/>\n' +
        '```\n' +
        '\n' +
        '\n' +
        '|左对齐|中间对齐|右对齐|\n' +
        '|:-----------|:-----------:|-----------:|\n' +
        '|c|d|g|\n' +
        '|e|f|h|\n' +
        '\n' +
        '### 何方博客微信公众号\n' +
        '\n' +
        '[![](https://open.weixin.qq.com/qr/code?username=hefangblog "")](https://hefang.link "")\n'}
                        onChange={(html, markdown) => {
                            hl = html;
                            md = markdown;
                        }}/>
    </div>
    <div>
        <button onClick={e => {
            console.clear();
            console.log(md);
            alert('内容已输出到控制台');
        }}>获取Markdown
        </button>
        <button onClick={e => {
            console.clear();
            console.log(hl);
            alert('内容已输出到控制台');
        }}>转换为HTML
        </button>
    </div>
</>, document.body);