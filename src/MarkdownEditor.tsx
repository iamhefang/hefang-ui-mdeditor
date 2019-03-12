import * as React from "react";
import {RefObject} from "react";
import {Ace, edit} from "ace-builds";
import {execute, guid, isFunction, type, Types} from "hefang-js";
import {Dialog, Icon} from "hefang-ui-react";
import * as marked from "marked"
import {Renderer} from "marked"
import "code-prettify";
import {FontAwesomeRenderer} from "./marked/renderer/FontAwesomeRenderer";
import {toolsMap} from "./toolbars";
import {IToolBarItem} from "./IToolBarItem";
import {ClipboardEventHandler} from "react";
import {DragEventHandler} from "react";
import Point = Ace.Point;


declare const PR;


export interface MarkdownEditorProps {
    id?: string
    showPreview?: boolean
    bindScroll?: boolean
    toolbar?: string[]
    onChange?: (html: string, markdown?: string) => void
    onPreviewVisibleChange?: (shown: boolean) => boolean | void
    value?: string
    theme?: string
    customTools?: IToolBarItem[]
    dialogConfirm?: typeof Dialog.confirm
    dialogAlert?: typeof Dialog.alert
    enableUpload?: boolean
    onFileUpload?: (files: FileList, editor: MarkdownEditor) => boolean | void
}

export interface MarkdownEditorState {
    showPreview?: boolean
}

export class MarkdownEditor extends React.Component<MarkdownEditorProps, MarkdownEditorState> {
    public static readonly defaultProps: MarkdownEditorProps = {
        showPreview: true,
        toolbar: [
            'undo', 'redo', '|',
            'bold', 'italic', 'strikethrough', 'quote', '|',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '|',
            'list-ol', 'list-ul', 'line', '|',
            'link', 'table', 'image', '|',
            'keyboard', 'code', 'code-block', 'clock', 'fontawesome', 'clean', '|',
            'preview', 'help', 'about'
        ],
        bindScroll: true,
        theme: 'light',
        dialogConfirm: Dialog.confirm,
        dialogAlert: Dialog.alert,
        customTools: []
    };
    private ace: Ace.Editor;
    private renderer: Renderer = new FontAwesomeRenderer();
    private id: string;
    private silent: boolean = false;
    private refPreview: RefObject<HTMLDivElement> = React.createRef();
    private toolMap: { [key: string]: IToolBarItem } = toolsMap;

    constructor(props: MarkdownEditorProps) {
        super(props);
        this.id = props.id || guid();
        this.state = {
            showPreview: props.showPreview,
        };
        props.customTools.forEach(item => {
            this.toolMap[item.id] = item;
        })
    }

    /**
     * 插入内容到当前编辑器
     * @param content 内容
     * @param toFirst 是否插入到行头
     * @param forward 插入后光标移动位置
     */
    public insertMarkdown = (content: string, toFirst: boolean = false, forward: Point = null) => {
        if (!this.ace) return;
        if (toFirst) {
            const pos = this.ace.getCursorPosition();
            pos.column = 0;
            this.ace.getSession().insert(pos, content);
        } else {
            this.ace.insert(content);
        }
        if (forward) {
            const pos = this.ace.getCursorPosition();
            pos.column += forward.column;
            pos.row += forward.row;
            this.ace.moveCursorTo(pos.row, pos.column);
        }
        this.ace.focus();
    };

    /**
     * 插入图片
     * @param url 图片地址
     * @param description 图片描述
     * @param link 点击图片跳转的地址
     */
    public insertImage = (url: string, description?: string, link?: string) => {
        description = description ? ` "${description}"` : '""';

        const img = `![${description.trim()}](${url}${description})`;
        let md = link ? `[${img}](${link}${description})` : img;
        this.insertMarkdown(`\n${md}\n`, true)
    };

    /**
     * 插入代码块
     * @param code 代码
     * @param language 语言
     */
    public insertCodeBlock = (code: string, language?: string) => {
        code = code.replace(/`/g, '&#96;');
        this.insertMarkdown('\n```' + language + "\n" + code + '\n```\n')
    };

    /**
     * 清空文档
     */
    public clean = () => {
        this.ace.setValue('')
    };

    private onChange = () => {
        const markdown = this.ace.getValue()
            , html = this.renderHtml(markdown);
        this.silent || execute(this.props.onChange, html, markdown);
    };

    public renderHtml = (markdown: string) => {
        const html = marked(markdown, {renderer: this.renderer});
        this.state.showPreview && (this.refPreview.current.innerHTML = html);
        PR.prettyPrint();
        return html;
    };

    componentDidMount() {
        this.ace = edit(`editor${this.id}`, {
            mode: 'ace/mode/markdown',
            theme: 'ace/theme/github',
            wrap: 'free'
        });
        this.ace.setValue(this.props.value || '');
        this.onChange();
        this.ace.clearSelection();
        this.ace.focus();
        this.ace.on("change", this.onChange);
        this.ace.getSession().on("changeScrollTop", scrollTop => {
            this.state.showPreview && this.props.bindScroll && (this.refPreview.current.scrollTop = scrollTop)
        });
    }

    componentWillReceiveProps(nextProps: MarkdownEditorProps) {
        this.setState({showPreview: nextProps.showPreview}, () => {
            this.renderHtml(this.ace.getValue())
        })
    }

    componentDidUpdate(preProps: MarkdownEditorProps) {
        if (this.ace && this.ace.getValue() !== this.props.value) {
            this.silent = true;
            const select = this.ace.getSelection().isEmpty();
            this.ace.setValue(this.props.value || '');
            select && this.ace.clearSelection();
            this.silent = false;
        }
    }

    private onPreviewScroll = () => {
        this.ace.getSession().setScrollTop(this.refPreview.current.scrollTop)
    };

    private handlePastedFile: ClipboardEventHandler<HTMLDivElement> = (e) => {
        if (!this.props.enableUpload || e.clipboardData.files.length < 1) return true;
        execute(this.props.onFileUpload, e.clipboardData.files, this);
        e.stopPropagation();
        e.preventDefault();
        return false;
    };

    private handleDraggedFile: DragEventHandler<HTMLDivElement> = (e) => {
        if (!this.props.enableUpload || e.dataTransfer.files.length < 1) return;
        e.dataTransfer.dropEffect = "copy";
        execute(this.props.onFileUpload, e.dataTransfer.files, this)
    };

    private renderToolbar = () => {
        return this.props.toolbar.map(id => {
            if (id === '|') {
                return <span className='toolbar-decollator'>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            } else if (id === '\\') {
                return <br/>
            } else if (id in this.toolMap) {
                const tool = this.toolMap[id];
                let icon = tool.icon;
                if (type(icon) === Types.String) {
                    icon = <Icon name={icon as string}/>
                } else if (isFunction(icon)) {
                    icon = execute(icon, this);
                }
                return <button title={isFunction(tool.name) ? execute(tool.name, this) : tool.name} onClick={e => {
                    execute(tool.action, this, this.ace);
                }}><span className='toolbar-icon'>{icon}</span></button>
            } else {
                return undefined;
            }
        });
    };

    render() {
        return <div className='markdown-editor display-flex-column'>
            <div className='markdown-editor-toolbar'>
                {this.renderToolbar()}
            </div>
            <div className='flex-1 display-flex-row'>
                <div id={`editor${this.id}`} className='flex-1 markdown-editor-ace'
                     onPaste={this.handlePastedFile}
                     onDrag={this.handleDraggedFile}/>
                {this.state.showPreview ?
                    <div className="flex-1 markdown-body" onScroll={this.onPreviewScroll}
                         ref={this.refPreview}/> : undefined}
            </div>
        </div>
    }
}
