import {IToolBarItem} from "./IToolBarItem";
import * as React from "react";
import {Ace, edit} from "ace-builds";
import {execute, formatDate, guid, range, repeat} from "hefang-js";
import {DialogOperater, Icon} from "hefang-ui-react";
import * as pkg from "../package.json"
import {Icons} from "./icons";
import {MarkdownEditor} from "./MarkdownEditor";

const langs = {
    java: "Java",
    python: "Python",
    bash: "Bash",
    sql: "SQL",
    html: "HTML",
    xml: "XML",
    css: "CSS",
    javascript: "JavaScript",
    typescript: "TypeScript",
    makefile: "Makefile",
    rust: "Rust",
    jsx: "React JSX",
    php: "PHP",
    markdown: "Markdown",
    cpp: 'C/C++'
};

export const toolsArray: IToolBarItem[] = [
    {
        id: 'undo',
        name: '撤销',
        icon: 'undo',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            ace.undo();
        }
    },
    {
        id: 'redo',
        name: '重做',
        icon: 'redo',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            ace.redo();
        }
    },
    {
        id: 'bold',
        name: '粗体',
        icon: 'bold',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            editor.insertMarkdown('**' + ace.getSelectedText() + '**')
        }
    },
    {
        id: 'italic',
        name: '斜体',
        icon: 'italic',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {

        }
    },
    {
        id: 'strikethrough',
        name: '斜体',
        icon: 'strikethrough',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {

        }
    },
    {
        id: 'quote-left',
        name: '引用',
        icon: 'quote-left',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            editor.insertMarkdown("> ", true)
        }
    },
    {
        id: 'line',
        name: '横线',
        icon: 'minus',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            editor.insertMarkdown("\n----------\n\n", true)
        }
    },
    {
        id: 'link',
        name: '链接',
        icon: 'link',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            editor.props.dialogConfirm(<form className='hui-dialog-content'>
                <div className="form-group">
                    <label htmlFor="editorAddLinkTitle" className='display-block'>链接标题</label>
                    <input type="text" className='hui-input display-block' name='editorAddLinkTitle'/>
                </div>
                <div className="form-group">
                    <label htmlFor="editorAddLinkUrl" className='display-block'>链接地址</label>
                    <input type="url" className='hui-input display-block' name='editorAddLinkUrl'/>
                </div>
            </form>, "插入链接", (dialog) => {
                const form = dialog.contentElement() as HTMLFormElement
                    , url = form.editorAddLinkUrl as HTMLInputElement
                    , title = form.editorAddLinkTitle as HTMLInputElement;
                editor.insertMarkdown(`[${title.value}](${url.value} "${title.value}")`)
            }, {
                icon: 'link',
                width: 345,
                height: 285
            })
        }
    },
    {
        id: 'table',
        name: '表格',
        icon: 'table',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            const id = guid();
            editor.props.dialogConfirm(<form className='hui-dialog-content' id={id}>
                行数：<input type="number" className='hui-input' name='rows' min={1} style={{width: '5rem'}}
                          defaultValue={'2'}/>
                &nbsp;
                列数：<input type="number" className='hui-input' name='columns' min={1} style={{width: '5rem'}}
                          defaultValue={'2'}/>
                <p>
                    对齐：
                    <label style={{margin: '0 .2rem'}}>
                        <input type="radio" name='align' value='none' defaultChecked={true}/> <Icon
                        name='align-justify'/>
                    </label>
                    <label style={{margin: '0 .2rem'}}>
                        <input type="radio" name='align' value='left'/> <Icon name='align-left'/>
                    </label>
                    <label style={{margin: '0 .2rem'}}>
                        <input type="radio" name='align' value='center'/> <Icon name='align-center'/>
                    </label>
                    <label style={{margin: '0 .2rem'}}>
                        <input type="radio" name='align' value='right'/> <Icon name='align-right'/>
                    </label>
                </p>
            </form>, "插入表格", (dialog) => {
                const form = dialog.contentElement() as HTMLFormElement
                    , rows = +form.rows.value
                    , columns = +form.columns.value
                    , align = form.align.value
                    , lines = repeat('  |  ', columns + 1).trim()
                    , lineArr = lines.split('')
                    , alignMap = {
                    left: ':-----------',
                    center: ':-----------:',
                    right: '-----------:',
                    none: '-----------'
                };
                editor.insertMarkdown(`\n${lines}\n${lineArr.join(alignMap[align])}\n${repeat(lines + "\n", rows)}\n`)
            }, {
                icon: 'link',
                width: 310,
                height: 200
            })
        }
    },
    {
        id: 'image',
        name: '图片',
        icon: 'image',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            console.log(1);
            editor.showInsertImageDialog();
            console.log(2);
        }
    },
    {
        id: 'clock',
        name: '当前时间',
        icon: 'clock',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            editor.insertMarkdown(formatDate(new Date))
        }
    },
    {
        id: 'preview',
        name: editor => {
            return editor.state.showPreview ? '关闭预览' : '开启预览'
        },
        icon: (editor: MarkdownEditor) => {
            return <Icon name={editor.state.showPreview ? 'eye-slash' : 'eye'}/>
        },
        action: function (editor: MarkdownEditor, ace: Ace.Editor) {
            if (execute(editor.props.onPreviewVisibleChange, !editor.state.showPreview) !== false) {
                editor.setState({showPreview: !editor.state.showPreview}, () => {
                    editor.renderHtml(ace.getValue())
                })
            }
        }
    },
    {
        id: 'help',
        name: '帮助',
        icon: 'question-circle',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            editor.props.dialogAlert(<div className='hui-dialog-content markdown-body'
                                          style={{overflow: 'auto', width: '100%', height: '100%'}}>
                <h2>快捷键</h2>
                <table style={{width: '100%'}}>
                    <thead>
                    <tr>
                        <th>按键</th>
                        <th>功能</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <kbd>Ctrl</kbd>+<kbd>D</kbd>
                        </td>
                        <td>删除当前行</td>
                    </tr>
                    <tr>
                        <td>
                            <kbd>Ctrl</kbd>+<kbd>F</kbd>
                        </td>
                        <td>搜索</td>
                    </tr>
                    <tr>
                        <td>
                            <kbd>Ctrl</kbd>+<kbd>H</kbd>
                        </td>
                        <td>替换</td>
                    </tr>
                    </tbody>
                </table>
            </div>, '帮助', {
                icon: 'question-circle',
                minHeight: 450,
                minWidth: 600,
                width: 600,
                height: 450,
                resizable: true,
                maximizable: true,
                maxHeight: window.innerHeight,
                maxWidth: window.innerWidth
            })
        }
    },
    {
        id: 'about',
        name: '关于',
        icon: 'info-circle',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            editor.props.dialogAlert(
                <div className="hui-dialog-content markdown-body"
                     style={{padding: '1rem'}}>
                    <div style={{marginBottom: '1rem'}}>
                        <img src="https://img.shields.io/github/stars/iamhefang/hefang-ui-mdeditor.svg" alt="stars"/>
                        &nbsp;
                        <img src="https://img.shields.io/github/forks/iamhefang/hefang-ui-mdeditor.svg" alt="forks"/>
                        &nbsp;
                        <img src="https://img.shields.io/github/issues/iamhefang/hefang-ui-mdeditor.svg" alt="issues"/>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>项目</th>
                            <th>依赖项目</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <ol>
                                    <li>基于 React</li>
                                    <li>
                                        在 <a href="https://github.com/iamhefang/hefang-ui-mdeditor"
                                             target='_blank'>Github</a> 开源
                                    </li>
                                    <li>可<a href="http://hefang.link/markdown.html" target='_blank'>在线使用</a></li>
                                    <li>免费</li>
                                    <li>可商用</li>
                                    <li>
                                        <a href="https://github.com/iamhefang/hefang-ui-mdeditor/blob/master/LICENSE"
                                           target='_blank'>{pkg.license}</a>
                                    </li>
                                </ol>
                            </td>
                            <td>
                                <ol>
                                    <li>
                                        <a href="https://reactjs.org/" target='_blank'>React</a>
                                    </li>
                                    <li>
                                        <a href="https://github.com/iamhefang/hefang-ui-react"
                                           target='_blank'>hefang-ui</a>
                                    </li>
                                    <li>
                                        <a href="https://github.com/markedjs/marked" target='_blank'>marked</a>
                                    </li>
                                    <li>
                                        <a href="https://fontawesome.com" target='_blank'>FontAwesome</a>
                                    </li>
                                    <li>
                                        <a href="https://github.com/google/code-prettify"
                                           target='_blank'>code-prettify</a>
                                    </li>
                                    <li>
                                        <a href="https://github.com/sindresorhus/github-markdown-css"
                                           target='_blank'>github-markdown-css</a>
                                    </li>
                                    <li>
                                        <a href="https://github.com/adrai/flowchart.js" target='_blank'>flowchart.js</a>
                                    </li>
                                </ol>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>, '关于 ' + pkg.name, {
                    icon: 'info-circle',
                    width: 420, height: 420
                })
        }
    },
    {
        id: 'clean',
        name: '清空内容',
        icon: 'eraser',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            editor.props.dialogConfirm("确定要清空全部内容吗？", () => {
                ace.setValue('')
            })
        }
    },
    {
        id: 'code',
        name: '行内代码',
        icon: 'code',
        action: (editor, ace) => {
            const txt = ace.getSelectedText();
            editor.insertMarkdown('`' + txt + '`', false, {row: 0, column: txt ? 0 : -1})
        }
    },
    {
        id: 'keyboard',
        name: '插入按键',
        icon: 'keyboard',
        action: (editor, ace) => {
            const txt = ace.getSelectedText();
            editor.insertMarkdown('<kbd>' + txt + '</kbd>', false, {row: 0, column: txt ? 0 : -6})
        }
    },
    {
        id: 'code-block',
        name: '代码块',
        icon: 'file-code',
        action: (editor, ace) => {
            let aceEditor: Ace.Editor, lang = '';
            const id = guid()
                , onLangChange = e => {
                if (e.currentTarget.value) {
                    aceEditor.setOption('mode', 'ace/mode/' + e.currentTarget.value);
                    lang = e.currentTarget.value;
                }
            };
            editor.props.dialogConfirm(<form id={id} className='hui-dialog-content'>
                <p>代码语言：<select name="language"
                                className='hui-input'
                                onChange={onLangChange}
                                id={`lang${id}`}>
                    <option value="">请选择代码语言</option>
                    {Object.keys(langs).map(value => <option value={value}>{langs[value]}</option>)}
                </select></p>
                <div id={`aceeditor${id}`} style={{height: '20rem', marginTop: '1rem'}}
                     className='display-block hui-input no-resize'/>
            </form>, "插入代码块", (dialog) => {
                editor.insertCodeBlock(aceEditor.getValue(), lang);
            }, {
                icon: 'file-code',
                width: 500, height: 500,
                componentDidMount: (dialog: DialogOperater) => {
                    const lang = (document.getElementById(`lang${id}`) as HTMLSelectElement).value
                        , opt: Partial<Ace.EditorOptions> = {
                        theme: 'ace/theme/github',
                        fontSize: 16
                    };
                    if (lang) {
                        opt.mode = `ace/mode/${lang}`
                    }
                    aceEditor = edit(`aceeditor${id}`, opt);
                }
            });
        }
    },
    {
        id: 'fontawesome',
        name: 'Font Awesome 图标',
        icon: <Icon name='font-awesome' namespace={"fab"}/>,
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            const selectedRowColumn = {}
                , onClick = (name: string, namespace: string) => {
                if (`${namespace}_${name}` in selectedRowColumn) {
                    delete selectedRowColumn[`${namespace}_${name}`];
                    document.getElementById(`td${namespace}_${name}`).style.background = 'none';
                } else {
                    document.getElementById(`td${namespace}_${name}`).style.background = 'gray';
                    selectedRowColumn[`${namespace}_${name}`] = true;
                }
            };
            editor.props.dialogConfirm(<div className="hui-dialog-content dialog-font-awesome">
                {Icons.fa.map(icon =>
                    <button id={`tdfa_${icon}`} className="no-border no-background"
                            title={icon}
                            onClick={e => onClick(icon, 'fa')}>
                        <Icon name={icon}
                              namespace={'fa'}/>
                    </button>)}
                {Icons.fab.map(icon =>
                    <button id={`tdfab_${icon}`} className="no-border no-background"
                            title={icon}
                            onClick={e => onClick(icon, 'fab')}>
                        <Icon name={icon}
                              namespace={'fab'}/>
                    </button>)}
            </div>, "插入FontAwesome图标", (dialog) => {
                let md = '';
                for (let key in selectedRowColumn) {
                    const [namespace, name] = key.split('_');
                    md += `:${namespace} ${name}:\n`
                }
                editor.insertMarkdown(md)
            }, {
                icon: <Icon name='font-awesome' namespace={"fab"} className='hui-dialog-icon'/>,
                width: 800,
                height: 600,
                maxHeight: window.innerHeight,
                maxWidth: window.innerWidth
            })
        }
    }
];
export const toolsMap: { [key: string]: IToolBarItem } = {};

range(1, 6).forEach(level => {
    toolsArray.push({
        id: 'h' + level,
        name: '标题' + level,
        icon: <span>H{level}</span>,
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            const pos = ace.getCursorPosition()
                , doc = ace.getSession().getDocument()
                , line = doc.getLine(pos.row)
                , text = repeat('#', level) + ' ';

            if (line.startsWith(text)) {
                ace.getSelection().selectLine();
                editor.insertMarkdown(line.replace(text, '') + "\n");
                ace.moveCursorTo(pos.row, pos.column - level);
            } else if (/^#{1,6} (.*?)/i.test(line)) {
                ace.getSelection().selectLine();
                editor.insertMarkdown(line.replace(/#{1,6} /, text) + "\n");
                ace.moveCursorTo(pos.row, pos.column - level);
            } else {
                pos.column = 0;
                ace.getSession().insert(pos, repeat('#', level) + ' ');
            }
            ace.focus();
        }
    })
});

['list-ol', 'list-ul'].forEach(id => {
    toolsArray.push({
        id: id,
        name: (id === 'list-ol' ? '有序' : '无序') + '列表',
        icon: id,
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            const text = ace.getSelectedText().trim()
                , prefix = id === 'list-ol' ? '1. ' : '- ';

            if (text) {
                editor.insertMarkdown(prefix + text.replace(/\n/g, `\n${prefix}`))
            } else {
                editor.insertMarkdown(prefix, true)
            }
        }
    })
});

toolsArray.forEach(tool => {
    toolsMap[tool.id] = tool;
});

