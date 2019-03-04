import {IToolBarItem} from "./IToolBarItem";
import * as React from "react";
import {Ace} from "ace-builds";
import {execute, formatDate, guid, range, repeat} from "hefang-js";
import {Icon} from "hefang-ui-react";
import * as pkg from "../package.json"
import {Icons} from "./icons";
import {MarkdownEditor} from "./MarkdownEditor";
import Point = Ace.Point;

function insertMarkdown(content: string, ace: Ace.Editor, toFirst: boolean = false, forward: Point = null) {
    if (toFirst) {
        const pos = ace.getCursorPosition();
        pos.column = 0;
        ace.getSession().insert(pos, content);
    } else {
        ace.insert(content);
    }
    if (forward) {
        // forward = extend(true, forward, {row: 0, column: 0});
        const pos = ace.getCursorPosition();
        pos.column += forward.column;
        pos.row += forward.row;
        ace.moveCursorTo(pos.row, pos.column);
    }
    ace.focus();
}

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
            insertMarkdown("> ", ace, true)
        }
    },
    {
        id: 'line',
        name: '横线',
        icon: 'minus',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            insertMarkdown("\n----------\n\n", ace, true)
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
                    , url = form.editorAddLinkUrl  as HTMLInputElement
                    , title = form.editorAddLinkTitle  as HTMLInputElement;
                insertMarkdown(`[${title.value}](${url.value} "${title.value}")`, ace)
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
                    , lines = repeat('|', columns + 1)
                    , lineArr = lines.split('')
                    , alignMap = {
                    left: ':-----------',
                    center: ':-----------:',
                    right: '-----------:',
                    none: '-----------'
                };
                insertMarkdown(`\n${lines}\n${lineArr.join(alignMap[align])}\n${repeat(lines + "\n", rows)}\n`, ace)
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
            const id = guid();
            editor.props.dialogConfirm(<form id={id} className='hui-dialog-content'>
                <div className="form-group">
                    <label htmlFor="editorAddLinkTitle" className='display-block'>图片地址</label>
                    <input type="url" className='hui-input display-block' name='url' placeholder={'图片所在地址'}/>
                </div>
                <div className="form-group">
                    <label htmlFor="editorAddLinkUrl" className='display-block'>图片描述</label>
                    <input type="text" className='hui-input display-block' name='description'/>
                </div>
                <div className="form-group">
                    <label htmlFor="editorAddLinkUrl" className='display-block'>点击跳转</label>
                    <input type="url" className='hui-input display-block' name='link' placeholder='图片点击时跳转的链接'/>
                </div>
            </form>, '插入图片', (dialog) => {
                const form = dialog.contentElement() as HTMLFormElement
                    , url = form.url.value
                    , description = form.description.value
                    , link = form.link.value;
                insertMarkdown(`[![${description}](${url} "${description}")](${link} "${description}")`, ace, true)
            }, {icon: 'image', width: 400, height: 355})
        }
    },
    {
        id: 'clock',
        name: '当前时间',
        icon: 'clock',
        action: (editor: MarkdownEditor, ace: Ace.Editor) => {
            insertMarkdown(formatDate(new Date), ace)
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
            editor.props.dialogAlert(<div className='hui-dialog-content'
                                          style={{overflow: 'auto', width: '100%', height: '100%'}}>
                帮助
            </div>, '帮助', {
                icon: 'question-circle',
                minHeight: 450,
                minWidth: 600,
                width: 800,
                height: 600,
                resizable: true,
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
            editor.props.dialogAlert(<div className="hui-dialog-content">
                <p>开源在线 React Markdown 编辑器，{pkg.license}协议</p>
                <p>基于 <a href="https://github.com/iamhefang/hefang-ui-react" target='_blank'>hefang-ui</a> 开发</p>
            </div>, '关于 ' + pkg.name, {
                icon: 'info-circle',
                width: 500, height: 500
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
            insertMarkdown('`' + ace.getSelectedText() + '`', ace)
        }
    },
    {
        id: 'code-block',
        name: '代码块',
        icon: 'file-code',
        action: (editor, ace) => {
            const id = guid();
            editor.props.dialogConfirm(<form id={id} className='hui-dialog-content'>
                <p>代码语言：<select name="language" className='hui-input'>
                    <option value="">请选择代码语言</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="bash">Bash</option>
                    <option value="sql">SQL</option>
                    <option value="html">HTML</option>
                    <option value="xml">XML</option>
                    <option value="css">CSS</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="makefile">Makefile</option>
                    <option value="rust">Rust</option>
                    <option value="sql">SQL</option>
                    <option value="jsx">React JSX</option>
                    <option value="php">PHP</option>
                </select></p>
                <p style={{marginTop: '1rem'}}>
                    <textarea name='code' className='display-block hui-input no-resize' rows={15}/>
                </p>
            </form>, "插入代码块", (dialog) => {
                const form = dialog.contentElement() as HTMLFormElement
                    , lang = form.language.value
                    , code = form.code.value;
                insertMarkdown('\n```' + lang + '\n' + code + '\n```\n', ace)
            }, {
                icon: 'file-code',
                width: 500, height: 500
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
                insertMarkdown(md, ace)
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
                insertMarkdown(line.replace(text, '') + "\n", ace);
                ace.moveCursorTo(pos.row, pos.column - level);
            } else if (/^#{1,6} (.*?)/i.test(line)) {
                ace.getSelection().selectLine();
                insertMarkdown(line.replace(/#{1,6} /, text) + "\n", ace);
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
                insertMarkdown(prefix + text.replace(/\n/g, `\n${prefix}`), ace)
            } else {
                insertMarkdown(prefix, ace, true)
            }
        }
    })
});

toolsArray.forEach(tool => {
    toolsMap[tool.id] = tool;
});

